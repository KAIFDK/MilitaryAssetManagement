import { Router } from 'express';
import prisma from '../utils/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

// The Dashboard requires:
// Opening Balance, Closing Balance, Net Movement (Purchases + Transfer In - Transfer Out),
// Assigned, Expended.
// Filters: Date (startDate, endDate), Base, Equipment Type.

router.get('/metrics', async (req, res) => {
  try {
    const { baseId, equipmentTypeId, startDate, endDate } = req.query;
    
    // RBAC: Commanders only see their base
    const targetBaseId = req.user?.role === 'COMMANDER' ? req.user.baseId : (baseId ? String(baseId) : undefined);

    let baseFilter: any = {};
    if (targetBaseId) baseFilter.baseId = targetBaseId;
    if (equipmentTypeId) baseFilter.equipmentTypeId = String(equipmentTypeId);

    // Date filters for "Current Period"
    const periodStart = startDate ? new Date(String(startDate)) : new Date(0); // Default to beginning of time
    const periodEnd = endDate ? new Date(String(endDate)) : new Date();       // Default to now

    // 1. Calculate Opening Balance (Everything BEFORE periodStart)
    // Formula: sum(PURCHASE) + sum(TRANSFER_IN) - sum(TRANSFER_OUT) - sum(EXPENDITURE)
    // Note: Assignments don't change physical inventory count at the base, just its status.
    // However, if "Available Inventory" is the metric, then ASSIGNMENT reduces it. We'll track "Total Arsenal".
    
    const openingTx = await prisma.assetTransaction.groupBy({
      by: ['type'],
      where: {
        ...baseFilter,
        date: { lt: periodStart }
      },
      _sum: { quantity: true }
    });

    let openingBalance = 0;
    openingTx.forEach((tx: any) => {
      const q = tx._sum.quantity || 0;
      if (tx.type === 'PURCHASE' || tx.type === 'TRANSFER_IN') openingBalance += q;
      if (tx.type === 'TRANSFER_OUT' || tx.type === 'EXPENDITURE') openingBalance -= q;
    });

    // 2. Fetch Transactions IN the Current Period
    const periodTx = await prisma.assetTransaction.groupBy({
      by: ['type'],
      where: {
        ...baseFilter,
        date: { gte: periodStart, lte: periodEnd }
      },
      _sum: { quantity: true }
    });

    let purchases = 0;
    let transfersIn = 0;
    let transfersOut = 0;
    let assignments = 0;
    let expenditures = 0;

    periodTx.forEach((tx: any) => {
      const q = tx._sum.quantity || 0;
      if (tx.type === 'PURCHASE') purchases += q;
      if (tx.type === 'TRANSFER_IN') transfersIn += q;
      if (tx.type === 'TRANSFER_OUT') transfersOut += q;
      if (tx.type === 'ASSIGNMENT') assignments += q;
      if (tx.type === 'EXPENDITURE') expenditures += q;
    });

    const netMovement = purchases + transfersIn - transfersOut;
    const closingBalance = openingBalance + netMovement - expenditures;

    res.json({
      openingBalance,
      closingBalance,
      netMovement,
      purchases,
      transfersIn,
      transfersOut,
      assignments,
      expenditures
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

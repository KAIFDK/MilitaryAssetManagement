import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
router.use(authenticateToken); // Protect all transaction routes

// Validation schemas
const purchaseSchema = z.object({
  equipmentTypeId: z.string(),
  baseId: z.string(), // where it's being purchased for
  quantity: z.number().positive(),
  notes: z.string().optional()
});

const transferSchema = z.object({
  equipmentTypeId: z.string(),
  sourceBaseId: z.string(),
  destinationBaseId: z.string(),
  quantity: z.number().positive(),
  notes: z.string().optional()
});

const assignSchema = z.object({
  equipmentTypeId: z.string(),
  baseId: z.string(),
  quantity: z.number().positive(), // positive means assigning OUT of available inventory
  assigneeName: z.string(),
  notes: z.string().optional()
});

const expendSchema = z.object({
  equipmentTypeId: z.string(),
  baseId: z.string(),
  quantity: z.number().positive(),
  notes: z.string().optional()
});

// 1. PURCHASE
router.post('/purchase', requireRole(['ADMIN', 'LOGISTICS', 'COMMANDER']), async (req, res) => {
  try {
    const data = purchaseSchema.parse(req.body);
    // Commander can only purchase for their base
    if (req.user?.role === 'COMMANDER' && req.user.baseId !== data.baseId) {
      return res.status(403).json({ error: 'Commanders can only purchase for their assigned base' });
    }

    const tx = await prisma.assetTransaction.create({
      data: {
        type: 'PURCHASE',
        quantity: data.quantity,
        equipmentTypeId: data.equipmentTypeId,
        baseId: data.baseId,
        userId: req.user!.userId,
        notes: data.notes
      }
    });
    res.status(201).json(tx);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 2. TRANSFER
router.post('/transfer', requireRole(['ADMIN', 'LOGISTICS', 'COMMANDER']), async (req, res) => {
  try {
    const data = transferSchema.parse(req.body);
    if (data.sourceBaseId === data.destinationBaseId) {
      return res.status(400).json({ error: 'Source and destination cannot be the same' });
    }
    if (req.user?.role === 'COMMANDER' && req.user.baseId !== data.sourceBaseId) {
       return res.status(403).json({ error: 'Commanders can only transfer from their assigned base' });
    }

    // A transfer is 2 transactions: TRANSFER_OUT from source, TRANSFER_IN to destination
    // Use an interactive transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      const outTx = await tx.assetTransaction.create({
        data: {
          type: 'TRANSFER_OUT',
          quantity: data.quantity, // store as positive, math treats it as deduction
          equipmentTypeId: data.equipmentTypeId,
          baseId: data.sourceBaseId,
          referenceId: data.destinationBaseId,
          userId: req.user!.userId,
          notes: data.notes
        }
      });
      const inTx = await tx.assetTransaction.create({
        data: {
          type: 'TRANSFER_IN',
          quantity: data.quantity,
          equipmentTypeId: data.equipmentTypeId,
          baseId: data.destinationBaseId,
          referenceId: data.sourceBaseId,
          userId: req.user!.userId,
          notes: data.notes
        }
      });
      return { outTx, inTx };
    });
    
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 3. ASSIGN
router.post('/assign', requireRole(['ADMIN', 'COMMANDER']), async (req, res) => {
  try {
    const data = assignSchema.parse(req.body);
    if (req.user?.role === 'COMMANDER' && req.user.baseId !== data.baseId) {
      return res.status(403).json({ error: 'Commanders can only assign at their base' });
    }

    const tx = await prisma.assetTransaction.create({
      data: {
        type: 'ASSIGNMENT',
        quantity: data.quantity,
        equipmentTypeId: data.equipmentTypeId,
        baseId: data.baseId,
        referenceId: data.assigneeName, // Store who it was assigned to
        userId: req.user!.userId,
        notes: data.notes
      }
    });
    res.status(201).json(tx);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. EXPEND
router.post('/expend', requireRole(['ADMIN', 'COMMANDER']), async (req, res) => {
  try {
    const data = expendSchema.parse(req.body);
    if (req.user?.role === 'COMMANDER' && req.user.baseId !== data.baseId) {
      return res.status(403).json({ error: 'Commanders can only expend at their base' });
    }

    const tx = await prisma.assetTransaction.create({
      data: {
        type: 'EXPENDITURE',
        quantity: data.quantity,
        equipmentTypeId: data.equipmentTypeId,
        baseId: data.baseId,
        userId: req.user!.userId,
        notes: data.notes
      }
    });
    res.status(201).json(tx);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


// 5. HISTORY
// Get history with filters
router.get('/history', async (req, res) => {
  try {
    const { baseId, equipmentTypeId, type, startDate, endDate } = req.query;
    
    let where: any = {};
    if (baseId) where.baseId = String(baseId);
    if (equipmentTypeId) where.equipmentTypeId = String(equipmentTypeId);
    if (type) where.type = String(type);
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(String(startDate));
      if (endDate) where.date.lte = new Date(String(endDate));
    }

    // Role restrictions
    if (req.user?.role === 'COMMANDER') {
      where.baseId = req.user.baseId;
    }

    const transactions = await prisma.assetTransaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        equipmentType: true,
        base: true,
        user: { select: { id: true, name: true, role: true } }
      }
    });

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

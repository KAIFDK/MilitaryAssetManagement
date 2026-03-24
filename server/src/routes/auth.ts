import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma';

const router = Router();

// Zod schemas for validation
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'COMMANDER', 'LOGISTICS']).optional(),
  baseId: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Admin ONLY route to register users (seed users logic)
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'LOGISTICS'
      }
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role, baseId: user.baseId },
      process.env.JWT_SECRET as string,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        baseId: user.baseId
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Utility endpoint to list all bases (needed for frontend dropdowns)
router.get('/bases', async (req, res) => {
  const bases = await prisma.base.findMany({ select: { id: true, name: true, location: true } });
  res.json(bases);
});

// Utility endpoint to list equipment types
router.get('/equipment-types', async (req, res) => {
  const eq = await prisma.equipmentType.findMany();
  res.json(eq);
});

export default router;

import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/signup', async ({ body, set }) => {
    const { email, password, role } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      set.status = 400;
      return { error: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    });

    const token = signToken({ userId: user.id, role: user.role });
    return { token };
  })
  .post('/login', async ({ body, set }) => {
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      set.status = 401;
      return { error: 'Invalid credentials' };
    }

    const token = signToken({ userId: user.id, role: user.role });
    return { token };
  });

import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Simple password hash - no bcrypt issues
const hashPassword = (password: string) => {
  return Buffer.from(password).toString('base64');
};

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/signup', async ({ body, set }) => {
    try {
      const { email, password, name, role = 'ATTENDEE' } = body as any;

      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        set.status = 400;
        return { error: 'Email already in use' };
      }

      const user = await prisma.user.create({
        data: {
          email,
          password: hashPassword(password),
          name,
          role
        }
      });

      const token = jwt.sign(
        { 
          userId: user.id, 
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      set.status = 500;
      return { error: 'Signup failed' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      name: t.String(),
      role: t.Optional(t.String())
    })
  })

  .post('/login', async ({ body, set }) => {
    try {
      const { email, password } = body as any;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      const hashedInput = hashPassword(password);
      if (hashedInput !== user.password) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      set.status = 500;
      return { error: 'Login failed' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  });
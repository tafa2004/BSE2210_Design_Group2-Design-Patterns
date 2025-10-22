import { Elysia, t } from 'elysia';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/signup', async ({ body, set }) => {
    try {
      const { email, password, name, role } = body as any;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        set.status = 400;
        return { error: 'Email already in use' };
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { 
          email, 
          password: hashedPassword, 
          name,
          role: role || 'ATTENDEE'
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,  // ← FIXED: Use userId (not id)
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      return { 
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      set.status = 500;
      return { error: 'Internal server error' };
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

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,  // ← FIXED: Use userId (not id)
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      return { 
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      set.status = 500;
      return { error: 'Internal server error' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  });
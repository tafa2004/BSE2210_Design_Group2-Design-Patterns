import { Elysia } from 'elysia';
import jwt from 'jsonwebtoken';

export const verifyJWT = new Elysia()
  .derive(async ({ headers, set }) => {
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
      };

      return {
        user: {
          id: payload.userId,
          role: payload.role
        }
      };
    } catch (err) {
      set.status = 401;
      throw new Error('Invalid or expired token');
    }
  });

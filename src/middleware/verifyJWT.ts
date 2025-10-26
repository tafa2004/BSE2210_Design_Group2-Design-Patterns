import { Elysia, t } from 'elysia';
import jwt from 'jsonwebtoken';

export const verifyJWT = new Elysia()
  .derive({ as: 'global' }, async ({ headers, set }): Promise<{ user: { id: string; role: string } }> => {
    try {
      const authHeader = headers.authorization || headers.Authorization;
      
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        throw new Error('No token provided');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      return {
        user: {
          id: decoded.userId,
          role: decoded.role
        }
      };
    } catch (error) {
      set.status = 401;
      throw new Error('Invalid token');
    }
  });
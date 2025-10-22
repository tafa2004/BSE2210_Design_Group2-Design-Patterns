import { Elysia } from 'elysia';
import { verifyToken } from '../../utils/jwt';

export const authMiddleware = new Elysia({
  name: 'auth-middleware',
  beforeHandle({ request, set }) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    request.user = decoded;
  }
});

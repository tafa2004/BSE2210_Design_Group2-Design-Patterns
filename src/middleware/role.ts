import { Elysia } from 'elysia';

export const requireRole = (allowedRoles: string[]) =>
  new Elysia({
    name: 'role-check',
    beforeHandle({ request, set }) {
      const user = request.user as { role: string };

      if (!user || !allowedRoles.includes(user.role)) {
        set.status = 403;
        return { error: 'Forbidden: insufficient role' };
      }
    }
  });

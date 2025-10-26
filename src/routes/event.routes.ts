import { Elysia, t } from 'elysia';
import { verifyJWT } from '../middleware/verifyJWT';
import { PrismaClient } from '@prisma/client';
import { broadcast } from '../index';

const prisma = new PrismaClient();

export const eventRoutes = new Elysia({ prefix: '/events' })
  .use(verifyJWT)

  .get('/', async () => {
    const events = await prisma.event.findMany({
      where: { approved: true },
      include: { organizer: true }
    });
    return { success: true, data: events };
  })

  .post('/', async ({ body, user, set }) => {
    const { title, description, date, location } = body;

    if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
      set.status = 403;
      return { error: 'Only organizers or admins can create events' };
    }

    if (!title || !description || !date || !location) {
      set.status = 400;
      return { error: 'Missing required fields' };
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizerId: user.id
      }
    });

    broadcast('event_created', event);
    return { success: true, data: event };
  }, {
    body: t.Object({
      title: t.String(),
      description: t.String(),
      date: t.String(),
      location: t.String()
    })
  })

  .put('/:id', async ({ params, body, user, set }) => {
    const { id } = params;
    const { title, description, date, location } = body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing || existing.organizerId !== user.id) {
      set.status = 403;
      return { error: 'Not authorized to update this event' };
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location
      }
    });

    broadcast('event_updated', updated);
    return { success: true, data: updated };
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      title: t.String(),
      description: t.String(),
      date: t.String(),
      location: t.String()
    })
  })

  .delete('/:id', async ({ params, user, set }) => {
    const { id } = params;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing || existing.organizerId !== user.id) {
      set.status = 403;
      return { error: 'Not authorized to delete this event' };
    }

    await prisma.event.delete({ where: { id } });
    broadcast('event_deleted', { id });
    return { success: true, message: 'Event deleted' };
  }, {
    params: t.Object({
      id: t.String()
    })
  })

  .put('/approve/:id', async ({ params, user, set }) => {
    const { id } = params;

    if (user.role !== 'ADMIN') {
      set.status = 403;
      return { error: 'Only admins can approve events' };
    }

    const approved = await prisma.event.update({
      where: { id },
      data: { approved: true }
    });

    broadcast('event_approved', approved);
    return { success: true, data: approved };
  }, {
    params: t.Object({
      id: t.String()
    })
  });
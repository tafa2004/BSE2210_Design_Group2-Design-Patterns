import { Elysia } from 'elysia';
import { verifyJWT } from '../middleware/verifyJWT';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const eventRoutes = new Elysia({ prefix: '/events' })
  .use(verifyJWT)

  // 🔹 Get all approved events
  .get('/', async () => {
    const events = await prisma.event.findMany({
      where: { approved: true },
      include: { organizer: true }
    });
    return events;
  }, {
    detail: {
      tags: ['Events'],
      summary: 'Get all approved events',
      description: 'Returns a list of all approved events with organizer info'
    }
  })

  // 🔹 Create a new event
  .post('/', async ({ body, user, set }) => {
    const { title, description, date, location } = body;

    if (!title || !description || !date || !location) {
      set.status = 400;
      return { error: 'Missing required fields' };
    }

    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      set.status = 403;
      return { error: 'Only organizers or admins can create events' };
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

    return event;
  }, {
    body: {
      title: 'string',
      description: 'string',
      date: 'string',
      location: 'string'
    },
    detail: {
      tags: ['Events'],
      summary: 'Create a new event',
      description: 'Organizers or admins can create events'
    }
  })

  // 🔹 Update an event
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

    return updated;
  }, {
    body: {
      title: 'string',
      description: 'string',
      date: 'string',
      location: 'string'
    },
    detail: {
      tags: ['Events'],
      summary: 'Update an event',
      description: 'Only the organizer can update their own event'
    }
  })

  // 🔹 Delete an event
  .delete('/:id', async ({ params, user, set }) => {
    const { id } = params;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing || existing.organizerId !== user.id) {
      set.status = 403;
      return { error: 'Not authorized to delete this event' };
    }

    await prisma.event.delete({ where: { id } });
    return { message: 'Event deleted' };
  }, {
    detail: {
      tags: ['Events'],
      summary: 'Delete an event',
      description: 'Only the organizer can delete their own event'
    }
  })

  // 🔹 Approve an event
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

    return approved;
  }, {
    detail: {
      tags: ['Events'],
      summary: 'Approve an event',
      description: 'Only admins can approve events'
    }
  });

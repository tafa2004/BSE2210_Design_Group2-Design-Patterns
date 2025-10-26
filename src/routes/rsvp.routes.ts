import { Elysia, t } from 'elysia';
import { verifyJWT } from '../middleware/verifyJWT';
import { PrismaClient } from '@prisma/client';
import { broadcast } from '../index';

const prisma = new PrismaClient();

export const rsvpRoutes = new Elysia({ prefix: '/rsvps' })
  .use(verifyJWT)

  .get('/debug-auth', async (context) => {
    const { user, headers } = context;
    return { 
      user: user, 
      authHeader: headers.authorization,
      message: 'If user is null, token is not being passed correctly'
    };
  })

  .post('/:eventId', async (context) => {
    const { params, body, user, set } = context;
    const { eventId } = params as { eventId: string };
    const { status } = body as any;

    if (!user || !user.id) {
      set.status = 401;
      return { error: 'User not authenticated' };
    }

    const event = await prisma.event.findUnique({ 
      where: { id: eventId } 
    });
    
    if (!event) {
      set.status = 404;
      return { error: 'Event not found' };
    }

    try {
      const rsvp = await prisma.rSVP.upsert({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId
          }
        },
        update: { status },
        create: {
          userId: user.id,
          eventId,
          status
        }
      });

      broadcast('rsvp_created', rsvp);
      return { success: true, data: rsvp };
    } catch (error) {
      set.status = 500;
      return { error: 'Failed to create RSVP' };
    }
  }, {
    body: t.Object({
      status: t.String()
    })
  })

  .get('/my-rsvps', async (context) => {
    const { user, set } = context;
    
    if (!user || !user.id) {
      set.status = 401;
      return { error: 'User not authenticated' };
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { userId: user.id },
      include: { 
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            approved: true
          }
        } 
      }
    });

    return { success: true, data: rsvps };
  })

  .delete('/:eventId', async (context) => {
    const { params, user, set } = context;
    const { eventId } = params as { eventId: string };

    if (!user || !user.id) {
      set.status = 401;
      return { error: 'User not authenticated' };
    }

    try {
      const rsvp = await prisma.rSVP.findUnique({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId
          }
        }
      });

      if (!rsvp) {
        set.status = 404;
        return { error: 'RSVP not found' };
      }

      await prisma.rSVP.delete({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId
          }
        }
      });

      broadcast('rsvp_deleted', { eventId, userId: user.id });
      return { success: true, message: 'RSVP removed successfully' };
    } catch (error) {
      set.status = 500;
      return { error: 'Failed to remove RSVP' };
    }
  });
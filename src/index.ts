import dotenv from 'dotenv';
dotenv.config();

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './routes/auth.routes';
import { eventRoutes } from './routes/event.routes';
import { rsvpRoutes } from './routes/rsvp.routes';

const app = new Elysia()
  .use(swagger({
    path: '/swagger',
    documentation: {
      info: {
        title: 'PulseHub API',
        version: '1.0.0',
        description: 'API documentation for PulseHub event management app'
      }
    }
  }))
  .get('/', () => ({
    message: 'Welcome to PulseHub API',
    version: '1.0.0',
    docs: '/swagger'
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString()
  }))
  .ws('/ws', {
    open(ws) {
      console.log('WebSocket client connected');
      ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to PulseHub realtime updates' }));
    },
    message(ws, message) {
      console.log('Received message:', message);
    },
    close(ws) {
      console.log('WebSocket client disconnected');
    }
  })
  .use(authRoutes)
  .use(eventRoutes)
  .use(rsvpRoutes)
  .listen(8080);

console.log('✅ Elysia is running PulseHub at http://localhost:' + app.server?.port);
console.log('📘 Swagger docs available at http://localhost:' + app.server?.port + '/swagger');
console.log('🔴 WebSocket available at ws://localhost:' + app.server?.port + '/ws');

// Export app for broadcasting
export { app };


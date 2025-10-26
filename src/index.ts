import dotenv from 'dotenv';
dotenv.config();

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './routes/auth.routes';
import { eventRoutes } from './routes/event.routes';
import { rsvpRoutes } from './routes/rsvp.routes';

const wsClients = new Set<any>();

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
      wsClients.add(ws);
      console.log('WebSocket client connected. Total clients:', wsClients.size);
      ws.send(JSON.stringify({ 
        type: 'connected', 
        message: 'Welcome to PulseHub realtime updates',
        timestamp: new Date().toISOString()
      }));
    },
    message(ws, message) {
      console.log('Received message:', message);
    },
    close(ws) {
      wsClients.delete(ws);
      console.log('WebSocket client disconnected. Total clients:', wsClients.size);
    }
  })
  .use(authRoutes)
  .use(eventRoutes)
  .use(rsvpRoutes)
  .listen(8080);

console.log('✅ Elysia is running PulseHub at http://localhost:' + app.server?.port);
console.log('📘 Swagger docs available at http://localhost:' + app.server?.port + '/swagger');
console.log('🔴 WebSocket available at ws://localhost:' + app.server?.port + '/ws');

export const broadcast = (type: string, data: any) => {
  const message = JSON.stringify({ 
    type, 
    data, 
    timestamp: new Date().toISOString() 
  });
  
  wsClients.forEach((client) => {
    try {
      client.send(message);
    } catch (error) {
      console.error('Error broadcasting:', error);
    }
  });
  
  console.log(`Broadcasted`, type, 'to', wsClients.size, 'clients');
};

export { app };
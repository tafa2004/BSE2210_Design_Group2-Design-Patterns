import dotenv from 'dotenv';
dotenv.config();

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './routes/auth.routes';

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
  .use(authRoutes)
  .listen(8080);

console.log('Elysia is running PulseHub at http://localhost:' + app.server?.port);
console.log('Swagger docs available at http://localhost:' + app.server?.port + '/swagger');


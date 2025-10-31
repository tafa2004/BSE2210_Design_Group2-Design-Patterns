# BSE2210_Design_Group2-Design-Patterns

Team Members 
Kamenga Katendi 2410432
Alintula Silwimba 2410030
Tafadzwa Mungandaire 2420974 

Team Lead : Backend development - Basically did the project on my own with little or no help from my other members
Deployed backend  PulseHub app on Render URL-https://bse2210-design-group2-design-patterns.onrender.com
API documentation URL https://bse2210-design-group2-design-patterns.on render.com/swagger
GitHub repository project branch - pulsehub branch https://github.com/tafa2004/BSE2210_Design_Group2-Design-Patterns/pulsehub.git
https://www.loom.com/share/7f0325a52a7c492598b66718644f3843- the link to the Loom video demonstrating the user flow

🔐 JWT Authentication: Secure login and role-based access control for ADMIN, ORGANIZER, and USER
🧩 Modular Routing: Separate route files for auth, events, and RSVPs using Elysia.js
📘 Swagger Documentation: Auto-generated API docs for all endpoints
🔴 WebSocket Broadcasting: Real-time updates for event creation, approval, and RSVP actions
📅 RSVP Flow: Users can RSVP, view, and remove their responses with upsert logic
🧠 Design Principles Applied: SOLID, DRY, and separation of concerns for scalable code
✉️ Email Mocking (In Progress): Simulated notifications using Nodemailer with mock transport

This foundation sets the stage for a fully interactive, scalable event platform — ready for deployment and demo

🚀 Core Features at a Glance
- 🔐 JWT authentication with role-based access control (`ADMIN`, `ORGANIZER`, `USER`)
- 📘 Swagger documentation for all endpoints
- 🔴 WebSocket broadcasting for real-time event and RSVP updates
- 📅 RSVP creation, viewing, and removal with upsert logic
- ✉️ Email mocking via Nodemailer (in progress)
- 🧩 Modular route structure and reusable middleware
- 🧠 Design principles and patterns applied throughout


🧰 Tech Stack Overview

| Layer         | Tools Used                  |
|--------------|-----------------------------|
| Framework     | Elysia.js                   |
| ORM           | Prisma                      |
| Database      | PostgreSQL (Neon)           |
| Auth          | JWT                         |
| Realtime      | WebSockets                  |
| Docs          | Swagger via `@elysiajs/swagger` |
| Dev Tools     | Bun, VS Code, Insomnia      |


🔐 Role-Based Access Control
PulseHub uses JWT and RBAC to enforce secure, permission-aware access: Observer pattern
👤 USER
- Register, login
- View approved events
- RSVP to events
- View/manage own RSVPs

🧑‍💼 ORGANIZER
- Create, update, delete events
- View RSVPs for own events

🛡️ ADMIN
- Approve events
- View all RSVPs
- Full access to all endpoints

📘 Interactive API Documentation (Swagger)

Access Swagger UI at:
http://localhost:8080/swagger

Code
All routes are grouped by:
- `/auth` – login, register
- `/events` – create, update, delete, approve
- `/rsvps` – RSVP to events, view/remove RSVPs


🔴 Real-Time Event Broadcasting via WebSockets through the use of Factory Patterns as mentioned in the first asssignment as it handles different tpes of real time notifications for example in PulseHub email mocking
Connect to:
ws://localhost:8080/ws

Code
Broadcasted events:
- `event_created`
- `event_updated`
- `event_deleted`
- `event_approved`
- `rsvp_created`
- `rsvp_deleted`

Example client:
```js
const ws = new WebSocket('ws://localhost:8080/ws');
ws.onmessage = (e) => console.log('📨', JSON.parse(e.data));
📅 RSVP Management & User Interaction
RSVP with status: GOING, INTERESTED, NOT_GOING
Upsert logic ensures clean creation/update
Users can view and remove their RSVPs
Organizers see RSVPs for their events
✉️ Email Notification Simulation (Mock Transport)
Email mocking uses Nodemailer with stream transport to simulate notifications:
RSVP confirmation → sent to user
Event creation → sent to organizer
Event approval → sent to organizer

ts
const transporter = nodemailer.createTransport({
  streamTransport: true,
  newline: 'unix',
  buffer: true
});
Emails are logged in the console for testing.

📁 Codebase Structure & Organization
Code
src/
├── index.ts               # App entry point
├── middleware/
│   └── verifyJWT.ts       # Auth middleware
├── routes/
│   ├── auth.routes.ts
│   ├── event.routes.ts
│   └── rsvp.routes.ts
└── prisma/
    └── schema.prisma      # DB schema
🛠️ Getting Started & Setup Instructions
bash
bun install
bun run dev
Set your .env:

env
JWT_SECRET=yourSecretKey
DATABASE_URL=yourDatabaseURL
🚀 Deployment Strategy (Render + Neon)
Backend deployed to Render

PostgreSQL database hosted on Neon

Environment variables managed securely

🧠 Architecture & Design Principles
PulseHub’s backend is built with clarity, scalability, and maintainability in mind.

🔹 SOLID Principles
Principle	Application
Single Responsibility	Each route file handles one domain
Open/Closed	Middleware and broadcasting are extensible
Liskov Substitution	Role-based access supports interchangeable behavior
Interface Segregation	Prisma models and route schemas are separated
Dependency Inversion	Services like email and WebSocket are abstracted
🔹 DRY Principle
Shared logic abstracted into middleware
RSVP upsert avoids duplication
Broadcasting uses a single broadcast() function
🔹 Modularity
Routes grouped by domain
Middleware is reusable
Swagger auto-generates from schemas

🧩 Applied Software Design Patterns
🏭 Factory Pattern
Prisma Client generates model accessors
Route files act as factories for endpoint logic

🧩 Singleton Pattern
WebSocket client set (wsClients) is a singleton
Prisma Client reused across modules

👁️ Observer Pattern
WebSocket clients subscribe to /ws
Broadcast function notifies all observers

🗺️ Visual Role Flow: User, Organizer, Admin
Code
+----------------+       +------------------+       +----------------+
|    USER        |       |   ORGANIZER      |       |     ADMIN      |
+----------------+       +------------------+       +----------------+
| - Register     |       | - Create events  |       | - Approve events|
| - Login        |       | - Update events  |       | - View all RSVPs|
| - RSVP to event|       | - Delete events  |       | - Manage users  |
| - View RSVPs   |       | - View RSVPs     |       | - Full access   |
+----------------+       +------------------+       +----------------+

         WebSocket Broadcasts 
    [event_created, rsvp_created, event_approved, etc.]
✉️ Email Mocking Flow Overview
Code
+----------------+       +------------------+       +----------------+
|    USER        |       |   ORGANIZER      |       |     ADMIN      |
+----------------+       +------------------+       +----------------+
| RSVP to event  |       | Create event     |       | Approve event  |
|                |       |                  |       |                |
| → Mock email:  |       | → Mock email:    |       | → Mock email:  |
| "RSVP confirmed"|      | "Event created"  |       | "Event approved"|
+----------------+       +------------------+       +----------------+

✉️ Emails sent via Nodemailer (mock transport)  
📦 Output logged in console for testing
🎯 Project Objectives & Milestones
Implement secure authentication with email mocking
Add role-based access control
Enable real-time updates via WebSockets
Use Prisma ORM with Neon-hosted PostgreSQL
Generate Swagger API documentation
Deploy to Render
Apply SOLID, DRY, and modularity principles
Reflect on architecture in README and demo video

⚠️ Development Challenges & Reflections
Throughout the development of PulseHub, several challenges emerged that shaped both the technical decisions and the collaborative process:
🤝 Teamwork & Collaboration
Limited team coordination and inconsistent communication impacted task distribution and progress tracking.
As a result, much of the backend architecture, authentication logic, and real-time features were developed independently, requiring extra effort in planning and documentation.
🌐 Network & Infrastructure Issues
Frequent connectivity disruptions affected access to shared resources and slowed down testing cycles.
These interruptions required offline planning and local-first development strategies to maintain momentum.
🧬 Neon Server Challenges
Neon’s PostgreSQL hosting occasionally experienced latency and connection drops during peak development hours.
Prisma migrations and database seeding were delayed due to intermittent server availability.
These issues were mitigated by retry strategies, local fallback environments, and careful schema versioning.

Despite these obstacles, the project maintained a high standard of code quality, modularity, and documentation. These experiences reinforced the importance of clear communication, resilient infrastructure, and proactive problem-solving in software development.


🧪 Design Reflection & Engineering Insights
PulseHub’s backend isn’t just functional — it’s architecturally sound. From modular route design to real-time broadcasting, every layer is built to scale, adapt, and impress. The use of design patterns like Factory, Singleton, and Observer ensures that the system is both elegant and extensible.

This README captures the journey from scaffolding to a fully interactive backend. The upcoming demo video will showcase these principles in action.

AI was used in the PulseHub project:

🤖 AI-Assisted Development
Artificial Intelligence was used throughout the development of PulseHub to accelerate decision-making, improve documentation quality, and enhance architectural clarity. Specifically:
🧠 Design Guidance: AI provided step-by-step support in applying SOLID principles, modular architecture, and software design patterns.
🧪 Testing Strategy: AI assisted in planning API testing flows using Insomnia, including payload structure and authorization headers.
🔍 Troubleshooting: AI offered real-time debugging advice for Prisma errors, JWT middleware, and WebSocket broadcasting logic.

This collaborative use of AI ensured that PulseHub was not only functional, but also well-documented, scalable, and professionally presented.








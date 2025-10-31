 Event Management App

A simple monolithic event management system built for a Software Design assignment. It includes authentication, user roles, and real-time features.

 Project Overview

This project is a monolithic event management application built as part of a Software Design assignment. It allows users to register, log in, and interact with events based on their assigned roles. Admins can create, update, and manage events, while attendees can browse and register for them. The app also includes real-time features for live updates, ensuring a responsive and interactive experience. It demonstrates key software design principles such as modular architecture, role-based access control, and real-time communication.
https://www.loom.com/share/7f0325a52a7c492598b66718644f3843 - The link to the Loom demo video
 Tech Stack/tools used

- Node.js + Bun
- Elysia.js (backend)
- Prisma + PostgreSQL
- React (frontend)
- WebSockets (realtime)

 Features

- Login/signup
- Admin and Attendee roles
- Create and manage events
- Realtime updates

 Setup

1. Install dependencies  
   `bun install`

2. Setup Prisma  
   `npx prisma generate`  
   `npx prisma migrate dev`

3. Start the app  
   `bun dev`




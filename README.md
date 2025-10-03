<<<<<<< HEAD
# it-support-app
IT Support Service Management Portal User Dashboard: Complaint/request submission, update/delete, status tracking, commenting Admin Dashboard: View/update/delete all requests, manage users and roles, enforce predefined request statuses (pending, under process, examined, under observation, completed)
=======
# IT Support Service Management portal for CRK campus of CSIR-IITR

This is a full-stack web application for managing IT support requests, built with React (Vite), Node.js/Express, and PostgreSQL. The app is containerized using Docker and orchestrated with Docker Compose for easy local deployment.

## Features
- User registration, login, and IT service request submission
- Track and update service requests by request ID
- Admin dashboard for managing and updating request statuses
- Real-time status updates and user/admin communication
- Header with CSIR-IITR logo and portal name

## Project Structure
- `frontend/` - React + Vite frontend
- `backend/` - Node.js/Express backend with Prisma ORM
- `docker-compose.yml` - Orchestrates frontend, backend, and PostgreSQL

## Getting Started
1. Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2. Clone this repository.
3. Run `docker-compose up --build` from the project root.
4. Access the frontend at [http://localhost:3000](http://localhost:3000)
5. The backend API runs at [http://localhost:4000](http://localhost:4000)

## Environment Variables
- Backend uses `DATABASE_URL` for PostgreSQL connection (see `docker-compose.yml`).

## Development
- Frontend: React + Vite (TypeScript)
- Backend: Node.js + Express + Prisma ORM
- Database: PostgreSQL (Docker)

---

**Replace the CSIR-IITR logo in `frontend/public/csir-iitr-logo.png` as needed.**
>>>>>>> 0504806 (Initial commit)

# AeroNexus (flyAirways)

A futuristic flight booking application designed with a robust dual-stack architecture. Features an immersive user interface, dynamic Amadeus API integrations for authentic aerospace data, and advanced booking scheduling enabled by dual-database integration (MongoDB & PostgreSQL).

## Architecture

- **Frontend**: Built utilizing [Angular](https://angular.dev/) (v19+), styled with TailwindCSS, and enhanced with live particle effects and RxJS state orchestration.
- **Backend**: Built with [NestJS](https://nestjs.com/), heavily utilizing custom modules (`Auth`, `Flights`, `Bookings`) and integrating direct Amadeus API flight fetching capabilities.
- **Databases**: 
  - **MongoDB**: Used reliably for storing Users and caching general Flight information.
  - **PostgreSQL**: Used for the robust relational schema of `Bookings`, specifically storing details and client contact data for scheduling timely reminders.

---

## 🚀 Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js**: v18 or newer
- **MongoDB**: Running instances locally or via Atlas.
- **PostgreSQL**: Local running pgAdmin or equivalent server.

---

## 💽 Database Setup

Because the application relies on an intertwined dual-database approach, both must be configured before initializing the backend.

### 1. PostgreSQL Initialization
You must manually create the database before starting the backend to prevent connection errors. Open your terminal and use `psql` (or your preferred visual client) to create the database:

```bash
# Login to postgres
psql -U postgres

# Create the database
CREATE DATABASE "flyairways";
\q
```

*Note: You do not need to create tables manually. The NestJS application will automatically synchronize the schema and generate the `bookings` table via TypeORM upon successfully connecting to the database.*

### 2. Configure Environment Variables
Locate the `backend/.env` file (or create one) and match your valid Postgres credentials alongside the necessary API keys:

```env
MONGODB_URI=mongodb://localhost:27017/flyairways
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_actual_password
POSTGRES_DB=flyairways
```

---

## ⚙️ Backend Setup & Deployment

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run start:dev
   ```
   *The backend defaults to running locally on port `3000`.*

---

## 🌐 Frontend Setup & Deployment

1. Open a *new* terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the Angular development environment:
   ```bash
   ng serve
   ```
4. Access the revolutionary UI by opening your preferred browser and navigating to `http://localhost:4200/`.

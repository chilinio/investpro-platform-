# InvestPro Setup Guide

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security
SESSION_SECRET=your-super-secret-session-key

# Replit Auth
REPL_ID=your-repl-id
REPLIT_CLIENT_SECRET=your-client-secret
REPLIT_DOMAINS=localhost:5000,your-domain.com
ISSUER_URL=https://replit.com/oidc

# Server Configuration
PORT=5001
NODE_ENV=development
```

## Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file with your database credentials
3. Run the database migrations:
```bash
cd server
npm run db:push
```

## Development Setup

1. Install dependencies:
```bash
# Root directory
npm install

# Client directory
cd client
npm install

# Server directory
cd ../server
npm install
```

2. Start the development servers:
```bash
# From root directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5001

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio database GUI
- `npm run db:generate` - Generate migration files

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-level components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   └── index.css      # Global styles and Tailwind config
├── server/                # Express backend application
│   ├── src/
│   │   ├── index.ts      # Server entry point
│   │   ├── routes.ts     # API route definitions
│   │   ├── storage.ts    # Database operations
│   │   ├── db.ts         # Database connection
│   │   └── replitAuth.ts # Authentication configuration
└── package.json          # Project dependencies and scripts
```

## Features

- User authentication with Replit Auth
- Investment package browsing and selection
- User dashboard with portfolio statistics
- Investment management (create, view, cancel)
- Transaction tracking
- Protected API routes
- Responsive UI with Tailwind CSS 
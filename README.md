# Investment Tracking Application

A full-stack application for tracking and managing investments, built with TypeScript, React, and Node.js.

## Features

- User authentication and authorization
- Investment package management
- Real-time investment tracking
- Secure session management
- Rate limiting and security features
- Responsive design

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Express Validator
- Express Rate Limit
- Helmet for security
- JWT for authentication

### Frontend
- React with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invest
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# In the server directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Start the backend server (from server directory)
npm run dev

# Start the frontend server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### Investments
- GET /api/investments - Get user investments
- POST /api/investments - Create new investment
- GET /api/packages - Get available investment packages

### Contact
- POST /api/contact - Send contact message

## Security Features

- Rate limiting on API endpoints
- Helmet for security headers
- CORS protection
- Session management
- Input validation
- Error handling middleware

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Testing
```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
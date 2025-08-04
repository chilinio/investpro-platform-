# investpro-api (Vercel Backend)

## Setup

1. Install dependencies:
   ```sh
   cd api
   npm install
   ```

2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` (your Postgres connection string)
   - `JWT_SECRET` (any random string)
   - `FRONTEND_URL` (your deployed frontend URL, e.g., `https://your-frontend.vercel.app`)

3. Deploy to Vercel:
   - Push your code to GitHub
   - Connect your repo to Vercel
   - Vercel will auto-detect the `api/` directory and deploy your backend as serverless functions

4. Update your frontend’s `VITE_API_URL` to point to your deployed backend (e.g., `https://your-vercel-app.vercel.app/api`)

## Endpoints

- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login
- `GET /api/auth/me` — Get current user (JWT protected)
- `GET /api/investments/packages` — Get investment packages
- `GET /api/health` — Health check 
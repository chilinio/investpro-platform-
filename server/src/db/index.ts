import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// For development, we'll use a simple connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/investpro'
});

// Create the database instance
export const db = drizzle(pool, { schema });

export type Database = typeof db; 
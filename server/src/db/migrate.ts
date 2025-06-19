import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/investpro'
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations completed!');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
}); 
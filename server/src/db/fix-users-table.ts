import { db } from './index';
import { sql } from 'drizzle-orm';

async function fixUsersTable() {
  try {
    console.log('Fixing users table schema...');

    // First, let's check the current table structure
    const tableInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Current table structure:', tableInfo.rows);

    // Drop the existing users table and recreate it with correct schema
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE;`);

    // Recreate the users table with correct timestamp types
    await db.execute(sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Users table recreated with correct schema!');

    // Verify the fix
    const updatedTableInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Updated table structure:', updatedTableInfo.rows);

  } catch (error) {
    console.error('Error fixing users table:', error);
  } finally {
    process.exit();
  }
}

fixUsersTable(); 
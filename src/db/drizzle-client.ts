import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use the DATABASE_URL from .env file
const connectionString = process.env.DATABASE_URL || 
  `postgresql://postgres.${process.env.CEB_SUPABASE_ID}:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const sql = postgres(connectionString, { prepare: false });
export const db = drizzle(sql);
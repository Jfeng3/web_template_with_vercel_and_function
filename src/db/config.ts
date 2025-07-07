import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// You need to get your database password from Supabase dashboard
// Go to Settings > Database and copy the password
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || '[YOUR-PASSWORD]';

const connectionString = `postgresql://postgres.${process.env.CEB_SUPABASE_ID}:${SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const sql = postgres(connectionString, { prepare: false });
export const db = drizzle(sql);
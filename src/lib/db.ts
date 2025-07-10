import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const connectionString = import.meta.env.VITE_DATABASE_URL || '';

if (!connectionString) {
  throw new Error('Database connection string is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
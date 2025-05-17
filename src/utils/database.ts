import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

interface Database {
  messages: {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: Date;
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true'
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool
  })
});

export default pool;
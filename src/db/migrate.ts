import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function principal(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  await pool.end();
  console.log('Migrations appliquees.');
}

principal().catch((erreur) => {
  console.error('Echec des migrations :', erreur);
  process.exit(1);
});

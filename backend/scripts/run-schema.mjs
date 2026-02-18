import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

config({ path: join(root, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env. Add the connection string from Supabase Dashboard > Settings > Database.');
  process.exit(1);
}

const schemaPath = join(root, 'database', 'schema.sql');
const sql = readFileSync(schemaPath, 'utf8');

const client = new pg.Client({ connectionString: DATABASE_URL });

async function run() {
  try {
    await client.connect();
    await client.query(sql);
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Schema execution failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

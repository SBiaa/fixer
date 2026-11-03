import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

// Localmente as variáveis vêm do `.env.local` (criado pelo `vercel env pull`).
// Na Vercel elas já estão no ambiente.
if (existsSync('.env.local')) process.loadEnvFile('.env.local');

// Migrações usam a conexão direta (sem pooler).
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL não definida. Rode `vercel env pull` para baixar as variáveis.');

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
});

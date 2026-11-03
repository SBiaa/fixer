/**
 * Conexão com o banco. Só pode ser importado no servidor.
 * Usa o driver HTTP do Neon: sem pool de conexões, bom para funções da Vercel.
 */
import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL não definida. Rode `vercel env pull` para baixar as variáveis.');

export const db = drizzle(neon(url), { schema });

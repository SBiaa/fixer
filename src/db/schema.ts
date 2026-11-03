/**
 * Tabelas do banco (Neon Postgres, via Drizzle).
 * Mudou algo aqui? Rode `npm run db:generate` para criar a migração.
 */
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { CharacterDraft } from '@/lib/sr5/character';

/** Usuário do app. O id é o mesmo do Clerk (`user_...`). */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const characterStatus = pgEnum('character_status', ['draft', 'active', 'retired']);

/** Ficha. O conteúdo é o `CharacterDraft` inteiro, igual ao export JSON. */
export const characters = pgTable(
  'characters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull().default(''),
    status: characterStatus('status').notNull().default('draft'),
    draft: jsonb('draft').$type<CharacterDraft>().notNull(),
    schemaVersion: integer('schema_version').notNull(),
    /** Passo do assistente em que o jogador parou. */
    step: integer('step').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('characters_owner_idx').on(t.ownerId)],
);

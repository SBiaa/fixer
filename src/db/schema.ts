/**
 * Tabelas do banco (Neon Postgres, via Drizzle).
 * Mudou algo aqui? Rode `npm run db:generate` para criar a migração.
 */
import { date, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { CharacterDraft } from '@/lib/sr5/character';
import type { GoalTarget } from '@/lib/sr5/goals';

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
    /** Em jogo: dano marcado nos monitores. */
    physicalDamage: integer('physical_damage').notNull().default(0),
    stunDamage: integer('stun_damage').notNull().default(0),
    /** Em jogo: anotações livres do jogador. */
    playNotes: text('play_notes').notNull().default(''),
    /** Quando a criação foi finalizada (status passou a 'active'). */
    activatedAt: timestamp('activated_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('characters_owner_idx').on(t.ownerId)],
);

export const ledgerKind = pgEnum('ledger_kind', ['nuyen', 'karma']);

/**
 * Histórico de nuyen e karma. O saldo é a soma; nada é editado, só lançado.
 * Ex.: +5000 nuyen "Pagamento da missão X", -1200 nuyen "Munição".
 */
export const ledger = pgTable(
  'ledger',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(() => characters.id, { onDelete: 'cascade' }),
    kind: ledgerKind('kind').notNull(),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    missionId: uuid('mission_id').references(() => missions.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('ledger_character_idx').on(t.characterId, t.createdAt)],
);

export const missionStatus = pgEnum('mission_status', ['planned', 'active', 'done']);

/** Diário de missões/sessões de um personagem. */
export const missions = pgTable(
  'missions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(() => characters.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    status: missionStatus('status').notNull().default('active'),
    /** O que aconteceu, ganchos em aberto, NPCs. */
    notes: text('notes').notNull().default(''),
    playedOn: date('played_on'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('missions_character_idx').on(t.characterId)],
);

export const goalStatus = pgEnum('goal_status', ['active', 'done', 'dropped']);

/**
 * Metas do personagem (planejamento). `target` diz o que a meta pede
 * (ex.: { kind: 'attribute', attr: 'AGI', rating: 6 }); ver `lib/sr5/goals.ts`.
 */
export const goals = pgTable(
  'goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(() => characters.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    notes: text('notes').notNull().default(''),
    target: jsonb('target').$type<GoalTarget>().notNull(),
    status: goalStatus('status').notNull().default('active'),
    /** Ordem de prioridade (menor = mais importante). */
    position: integer('position').notNull().default(0),
    /** Quanto foi lançado no histórico ao concluir (se foi). */
    paid: integer('paid'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [index('goals_character_idx').on(t.characterId, t.position)],
);

/** Time de jogadores. Quem tem o link de convite entra com uma ficha. */
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  /** Código do link de convite. Trocar o código invalida o link antigo. */
  inviteCode: text('invite_code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Quem está no time é a ficha, não o jogador. Uma ficha pode estar em vários times. */
export const teamMembers = pgTable(
  'team_members',
  {
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    characterId: uuid('character_id')
      .notNull()
      .references(() => characters.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.characterId] }), index('team_members_character_idx').on(t.characterId)],
);

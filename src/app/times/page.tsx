import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AccountMenu } from '@/components/AccountMenu';
import { AppHeader } from '@/components/AppHeader';
import { CreateTeamForm } from '@/components/teams/TeamForms';
import { Card } from '@/components/ui';
import { listCharacters } from '@/server/characters';
import { listMyTeams } from '@/server/teams';

export const metadata: Metadata = { title: 'Times — Fixer' };

export default function TeamsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader>
        <AccountMenu showNav />
      </AppHeader>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="mb-2 font-display text-3xl font-semibold">Times</h1>
        <p className="mb-6 text-sm text-muted">
          Monte o time com seus companheiros de mesa: cada um entra com uma ficha pelo link de convite e todos veem como
          o time está.
        </p>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl border border-line bg-surface" />}>
          <Teams />
        </Suspense>
      </main>
    </div>
  );
}

async function Teams() {
  const [teams, characters] = await Promise.all([listMyTeams(), listCharacters()]);
  return (
    <div className="flex flex-col gap-6">
      {teams.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {teams.map((t) => (
            <li key={t.id}>
              <Link
                href={`/times/${t.id}`}
                className="block rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold">{t.name}</h2>
                  {t.isOwner && (
                    <span className="shrink-0 rounded-full border border-line-strong px-2 py-0.5 text-xs text-muted">
                      Seu time
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {t.members} {t.members === 1 ? 'ficha' : 'fichas'}
                  {t.myCharacters.length > 0 && ` · você joga com ${t.myCharacters.join(', ')}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Card title="Criar time">
        <CreateTeamForm characters={characters.map((c) => ({ id: c.id, name: c.name }))} />
      </Card>
    </div>
  );
}

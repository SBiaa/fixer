import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AccountMenu } from '@/components/AccountMenu';
import { AppHeader } from '@/components/AppHeader';
import { CharacterCardActions } from '@/components/characters/CharacterCardActions';
import { LocalImportBanner } from '@/components/characters/LocalImportBanner';
import { NewCharacterButton } from '@/components/characters/NewCharacterButton';
import { listCharacters, type CharacterSummary } from '@/server/characters';

export const metadata: Metadata = { title: 'Minhas fichas — Fixer' };

export default function MyCharactersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader>
        <AccountMenu showNav />
      </AppHeader>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold">Minhas fichas</h1>
          <NewCharacterButton />
        </div>
        <LocalImportBanner />
        <Suspense fallback={<ListSkeleton />}>
          <CharacterList />
        </Suspense>
      </main>
    </div>
  );
}

async function CharacterList() {
  const list = await listCharacters();
  if (list.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-strong p-8 text-center text-muted">
        Nenhuma ficha ainda. Clique em <strong className="text-ink">Nova ficha</strong> para criar a primeira.
      </p>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((c) => (
        <CharacterCard key={c.id} character={c} />
      ))}
    </ul>
  );
}

const STATUS_LABEL: Record<CharacterSummary['status'], string> = {
  draft: 'Em criação',
  active: 'Em jogo',
  retired: 'Aposentada',
};

const updatedFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

function CharacterCard({ character: c }: { character: CharacterSummary }) {
  return (
    <li className="flex flex-col rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50">
      <Link href={`/fichas/${c.id}`} className="flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">{c.name}</h2>
          <span className="shrink-0 rounded-full border border-line-strong px-2 py-0.5 text-xs text-muted">
            {STATUS_LABEL[c.status]}
          </span>
        </div>
        {c.role && <p className="text-sm text-muted">{c.role}</p>}
        <p className="mt-3 text-xs text-faint">Atualizada em {updatedFormat.format(c.updatedAt)}</p>
      </Link>
      <CharacterCardActions id={c.id} name={c.name} />
    </li>
  );
}

function ListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl border border-line bg-surface" />
      ))}
    </div>
  );
}

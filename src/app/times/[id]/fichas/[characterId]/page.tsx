import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AccountMenu } from '@/components/AccountMenu';
import { AppHeader } from '@/components/AppHeader';
import { TeammateSheet } from '@/components/teams/TeammateSheet';
import { NotFoundError } from '@/server/characters';
import { getTeammateSheet } from '@/server/teams';

export const metadata: Metadata = { title: 'Ficha do time — Fixer' };

export default function TeammatePage({ params }: PageProps<'/times/[id]/fichas/[characterId]'>) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader>
        <AccountMenu showNav />
      </AppHeader>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border border-line bg-surface" />}>
          <Teammate params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function Teammate({ params }: { params: PageProps<'/times/[id]/fichas/[characterId]'>['params'] }) {
  const { id, characterId } = await params;
  let sheet;
  try {
    sheet = await getTeammateSheet(id, characterId);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print">
        <Link href={`/times/${id}`} className="text-sm text-muted hover:text-ink">
          ← {sheet.teamName}
        </Link>
        <h1 className="font-display text-3xl font-semibold">{sheet.name}</h1>
        <p className="text-sm text-muted">
          {sheet.mine ? 'Sua ficha' : `Jogador: ${sheet.player}`}
          {sheet.status === 'draft' && ' · em criação'}
        </p>
      </div>
      <TeammateSheet draft={sheet.draft} physical={sheet.physical} stun={sheet.stun} active={sheet.status === 'active'} />
    </div>
  );
}

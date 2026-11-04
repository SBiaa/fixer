import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AccountMenu } from '@/components/AccountMenu';
import { AppHeader } from '@/components/AppHeader';
import { PlayView } from '@/components/play/PlayView';
import { CloudWizard } from '@/components/wizard/CloudWizard';
import { getCharacter, NotFoundError } from '@/server/characters';
import { getPlayData } from '@/server/play';

export const metadata: Metadata = { title: 'Ficha — Fixer' };

export default function CharacterPage({ params }: PageProps<'/fichas/[id]'>) {
  return (
    <Suspense fallback={<Loading />}>
      <Character params={params} />
    </Suspense>
  );
}

async function Character({ params }: { params: PageProps<'/fichas/[id]'>['params'] }) {
  const { id } = await params;
  let character;
  try {
    character = await getCharacter(id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  // Em criação: o assistente, salvando na conta.
  if (character.status === 'draft') {
    return (
      <CloudWizard
        id={character.id}
        initial={{ draft: character.draft, step: character.step }}
        account={<AccountMenu />}
      />
    );
  }

  // Finalizada: a ficha em jogo.
  const play = await getPlayData(id);
  return (
    <PlayView
      character={{
        id: play.character.id,
        name: play.character.name,
        draft: play.character.draft,
        physicalDamage: play.character.physicalDamage,
        stunDamage: play.character.stunDamage,
        playNotes: play.character.playNotes,
      }}
      entries={play.entries}
      missions={play.missions}
      goals={play.goals}
      header={
        <AppHeader>
          <Link
            href="/fichas"
            className="inline-flex items-center whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink sm:px-3.5"
          >
            Minhas fichas
          </Link>
          <AccountMenu />
        </AppHeader>
      }
    />
  );
}

function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center text-muted">
      <span className="animate-pulse font-display tracking-widest">CARREGANDO FICHA…</span>
    </div>
  );
}

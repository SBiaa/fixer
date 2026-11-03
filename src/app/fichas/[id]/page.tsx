import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AccountMenu } from '@/components/AccountMenu';
import { CloudWizard } from '@/components/wizard/CloudWizard';
import { getCharacter, NotFoundError } from '@/server/characters';

export const metadata: Metadata = { title: 'Ficha — Fixer' };

export default function CharacterPage({ params }: PageProps<'/fichas/[id]'>) {
  return (
    <Suspense fallback={<Loading />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<'/fichas/[id]'>['params'] }) {
  const { id } = await params;
  let character;
  try {
    character = await getCharacter(id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  return (
    <CloudWizard
      id={character.id}
      initial={{ draft: character.draft, step: character.step }}
      account={<AccountMenu />}
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

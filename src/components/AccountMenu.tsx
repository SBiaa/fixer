'use client';

import Link from 'next/link';
import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui';

/**
 * Visitante: botão "Entrar". Logado: link para "Minhas fichas" (se `showMyCharacters`)
 * e avatar com menu da conta.
 */
export function AccountMenu({ showMyCharacters = false }: { showMyCharacters?: boolean }) {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal" forceRedirectUrl="/fichas">
          <Button variant="ghost" className="whitespace-nowrap !px-2 sm:!px-3.5">
            Entrar
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        {showMyCharacters && (
          <Link
            href="/fichas"
            className="inline-flex items-center whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink sm:px-3.5"
          >
            Minhas fichas
          </Link>
        )}
        <div className="flex items-center px-2">
          <UserButton />
        </div>
      </Show>
    </>
  );
}

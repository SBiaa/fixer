'use client';

import Link from 'next/link';
import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui';
import { BASE_PATH } from '@/config/basePath';

const linkClass =
  'inline-flex items-center whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink sm:px-3.5';

/**
 * Visitante: botão "Entrar". Logado: links "Minhas fichas" e "Times"
 * (se `showNav`) e avatar com menu da conta.
 */
export function AccountMenu({ showNav = false }: { showNav?: boolean }) {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal" forceRedirectUrl={`${BASE_PATH}/fichas`}>
          <Button variant="ghost" className="whitespace-nowrap !px-2 sm:!px-3.5">
            Entrar
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        {showNav && (
          <>
            <Link href="/fichas" className={linkClass}>
              Minhas fichas
            </Link>
            <Link href="/times" className={linkClass}>
              Times
            </Link>
          </>
        )}
        <div className="flex items-center px-2">
          <UserButton />
        </div>
      </Show>
    </>
  );
}

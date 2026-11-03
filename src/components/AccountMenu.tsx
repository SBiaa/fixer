'use client';

import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui';

/** Botão "Entrar" para visitantes; avatar com menu para quem está logado. */
export function AccountMenu() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" className="whitespace-nowrap !px-2 sm:!px-3.5">
            Entrar
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center px-2">
          <UserButton />
        </div>
      </Show>
    </>
  );
}

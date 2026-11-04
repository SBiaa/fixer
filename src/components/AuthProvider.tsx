'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';

/**
 * ClerkProvider importado do lado do cliente, de propósito.
 *
 * O `@clerk/nextjs` do cliente carrega um módulo que renomeia o provider interno do Clerk
 * (`displayName = "ReactClerkProvider"`). Com o provider do servidor, esse módulo às vezes
 * já estava carregado (no build) e às vezes não (na hora de completar a página), e o React
 * via nomes diferentes no mesmo lugar: "Expected the resume to render <ReactClerkProvider>…",
 * perdendo o pré-render parcial. Importando aqui, o módulo sempre carrega antes do provider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={ptBR}
      signInUrl="/entrar"
      signUpUrl="/cadastro"
      signInFallbackRedirectUrl="/fichas"
      signUpFallbackRedirectUrl="/fichas"
    >
      {children}
    </ClerkProvider>
  );
}

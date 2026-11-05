'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import { BASE_PATH } from '@/config/basePath';

/**
 * ClerkProvider importado do lado do cliente, de propósito.
 *
 * O `@clerk/nextjs` do cliente carrega um módulo que renomeia o provider interno do Clerk
 * (`displayName = "ReactClerkProvider"`). Com o provider do servidor, esse módulo às vezes
 * já estava carregado (no build) e às vezes não (na hora de completar a página), e o React
 * via nomes diferentes no mesmo lugar: "Expected the resume to render <ReactClerkProvider>…",
 * perdendo o pré-render parcial. Importando aqui, o módulo sempre carrega antes do provider.
 *
 * As URLs do Clerk levam o BASE_PATH: ele tira o prefixo sozinho antes de navegar.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={ptBR}
      signInUrl={`${BASE_PATH}/entrar`}
      signUpUrl={`${BASE_PATH}/cadastro`}
      signInFallbackRedirectUrl={`${BASE_PATH}/fichas`}
      signUpFallbackRedirectUrl={`${BASE_PATH}/fichas`}
    >
      {children}
    </ClerkProvider>
  );
}

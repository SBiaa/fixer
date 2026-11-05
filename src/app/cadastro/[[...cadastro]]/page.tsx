import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignUp } from '@clerk/nextjs';
import { AppHeader } from '@/components/AppHeader';
import { BASE_PATH } from '@/config/basePath';

export const metadata: Metadata = { title: 'Criar conta — Fixer' };

export default function SignUpPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        {/* O SignUp lê a URL: fica num Suspense para o resto da página ser estático. */}
        <Suspense fallback={<div className="h-96 w-full max-w-sm animate-pulse rounded-xl bg-surface" />}>
          <SignUp path={`${BASE_PATH}/cadastro`} />
        </Suspense>
      </main>
    </div>
  );
}

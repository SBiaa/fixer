import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignIn } from '@clerk/nextjs';
import { AppHeader } from '@/components/AppHeader';
import { BASE_PATH } from '@/config/basePath';

export const metadata: Metadata = { title: 'Entrar — Fixer' };

export default function SignInPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        {/* O SignIn lê a URL: fica num Suspense para o resto da página ser estático. */}
        <Suspense fallback={<div className="h-96 w-full max-w-sm animate-pulse rounded-xl bg-surface" />}>
          <SignIn path={`${BASE_PATH}/entrar`} />
        </Suspense>
      </main>
    </div>
  );
}

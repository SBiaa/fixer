import Link from 'next/link';
import type { ReactNode } from 'react';

/** Cabeçalho das páginas fora do assistente (mesmo visual). */
export function AppHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="no-print scanlines sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-xl font-bold tracking-[0.2em] text-accent">FIXER</span>
          <span className="hidden text-sm text-muted sm:inline">criador de personagens · Shadowrun 5</span>
        </Link>
        <div className="flex items-center gap-1">{children}</div>
      </div>
    </header>
  );
}

import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import { Chakra_Petch, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const chakra = Chakra_Petch({ variable: '--font-chakra', subsets: ['latin'], weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Fixer — criador de personagens para Shadowrun 5',
  description:
    'Assistente passo a passo para criar personagens de Shadowrun 5ª edição pelo sistema de prioridades, pensado para iniciantes.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <ClerkProvider
      localization={ptBR}
      signInUrl="/entrar"
      signUpUrl="/cadastro"
      signInFallbackRedirectUrl="/fichas"
      signUpFallbackRedirectUrl="/fichas"
    >
      <html
        lang="pt-BR"
        className={`${geistSans.variable} ${geistMono.variable} ${chakra.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}

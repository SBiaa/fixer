import { clerkMiddleware } from '@clerk/nextjs/server';
import { BASE_PATH } from '@/config/basePath';

// "Minhas fichas", "Times" e convites exigem login. O assistente da página inicial continua aberto para visitantes.
// Quem protege de verdade são as páginas e Server Actions (`requireUserId()` em `server/characters.ts`);
// isto só manda o visitante para a tela de entrar antes de a página começar a renderizar.
const PRIVATE = ['/fichas', '/times', '/convite'];

function isPrivate(pathname: string) {
  return PRIVATE.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default clerkMiddleware(
  async (auth, req) => {
    if (isPrivate(req.nextUrl.pathname)) await auth.protect();
  },
  // Telas de login do próprio app (em português), no lugar das hospedadas pelo Clerk.
  { signInUrl: `${BASE_PATH}/entrar`, signUpUrl: `${BASE_PATH}/cadastro` },
);

export const config = {
  matcher: [
    // Ignora arquivos internos do Next e estáticos, salvo se vierem na query.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

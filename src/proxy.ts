import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// "Minhas fichas" exige login. O assistente da página inicial continua aberto para visitantes.
// (As funções do servidor também conferem o login; isto só manda para a tela de entrar mais cedo.)
const isPrivate = createRouteMatcher(['/fichas(.*)']);

export default clerkMiddleware(
  async (auth, req) => {
    if (isPrivate(req)) await auth.protect();
  },
  // Telas de login do próprio app (em português), no lugar das hospedadas pelo Clerk.
  { signInUrl: '/entrar', signUpUrl: '/cadastro' },
);

export const config = {
  matcher: [
    // Ignora arquivos internos do Next e estáticos, salvo se vierem na query.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

import { clerkMiddleware } from '@clerk/nextjs/server';

// Disponibiliza a sessão do Clerk para o app. Nenhuma rota é protegida ainda:
// o assistente continua aberto para quem não tem conta.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Ignora arquivos internos do Next e estáticos, salvo se vierem na query.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

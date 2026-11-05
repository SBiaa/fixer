import type { NextConfig } from "next";
import { BASE_PATH } from "./src/config/basePath";

// Domínios que mostram o Fixer pelo rewrite (o Alternative Space). Server Actions vindas deles são aceitas.
// Em produção, ponha o domínio em FICHAS_ALLOWED_ORIGINS se ele mudar ("a.com,b.com").
const allowedOrigins = (process.env.FICHAS_ALLOWED_ORIGINS ?? "alternativespace.com.br,www.alternativespace.com.br,localhost:3100")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  /* config options here */
  basePath: BASE_PATH,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: { allowedOrigins },
  },
  // Links antigos, de antes do basePath, continuam funcionando.
  async redirects() {
    const old = ["/", "/entrar/:path*", "/cadastro/:path*", "/times/:path*", "/convite/:path*", "/fichas", "/fichas/:id([0-9a-f-]{36})"];
    return old.map((source) => ({
      source,
      destination: `${BASE_PATH}${source === "/" ? "" : source}`,
      basePath: false as const,
      permanent: false,
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

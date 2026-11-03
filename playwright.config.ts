import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const CI = !!process.env.CI;

/**
 * Testes de ponta a ponta. Rodam contra o build de produção numa porta própria,
 * para não brigar com um `next dev` aberto.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    locale: 'pt-BR',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /responsivo/ },
    { name: 'celular', use: { ...devices['Pixel 7'] }, testMatch: /responsivo/ },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 180_000,
  },
});

import { expect, test } from '@playwright/test';

test('"Minhas fichas" sem login manda para a tela de entrar do app', async ({ page }) => {
  await page.goto('/fichas');
  await expect(page).toHaveURL(/\/entrar/);
  await expect(page.getByText('Continuar com Google')).toBeVisible();
});

test('ficha de outra pessoa (ou id inválido) também exige login', async ({ page }) => {
  await page.goto('/fichas/00000000-0000-0000-0000-000000000000');
  await expect(page).toHaveURL(/\/entrar/);
});

test('"Times" e links de convite também exigem login', async ({ page }) => {
  await page.goto('/times');
  await expect(page).toHaveURL(/\/entrar/);
  await page.goto('/convite/abcdefgh1234');
  await expect(page).toHaveURL(/\/entrar/);
});

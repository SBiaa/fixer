import { expect, test } from '@playwright/test';

test('no celular a página não rola para o lado e o resumo abre na gaveta', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Quem é o seu personagem?' })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await page.getByRole('button', { name: 'Resumo' }).click();
  await expect(page.getByRole('heading', { name: 'Resumo da ficha' })).toBeVisible();
  await page.getByRole('button', { name: 'Fechar' }).last().click();
  await expect(page.getByRole('heading', { name: 'Resumo da ficha' })).toBeHidden();
});

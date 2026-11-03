import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const FIXTURE = join(__dirname, 'fixtures/ficha-valida.json');
const ATTRS = ['Corpo', 'Agilidade', 'Reação', 'Força', 'Carisma', 'Intuição', 'Lógica', 'Vontade'];

const next = (page: Page) => page.getByRole('button', { name: /^Avançar:/ });
/** Títulos do conteúdo principal (o painel de resumo ao lado repete alguns). */
const heading = (page: Page, name: string) => page.getByRole('main').getByRole('heading', { name, exact: true });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(heading(page, 'Quem é o seu personagem?')).toBeVisible();
});

test('cria um samurai de rua do início ao fim e exporta o JSON', async ({ page }) => {
  // Conceito
  await page.getByPlaceholder('Ex.: Mariana Kowalski').fill('Mariana Kowalski');
  await page.getByPlaceholder('Ex.: Agulha').fill('Agulha');
  await page.getByRole('button', { name: 'Usar prioridades' }).first().click();
  await next(page).click();

  // Prioridades (já vieram do arquétipo)
  await expect(heading(page, 'Prioridades')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Atributos: prioridade A' })).toHaveAttribute('aria-pressed', 'true');
  await next(page).click();

  // Metatipo
  await expect(heading(page, 'Metatipo')).toBeVisible();
  await page.getByRole('button', { name: 'Humano', exact: true }).click();
  await next(page).click();

  // Atributos: 24 pontos (prioridade A) + 3 especiais em Trunfo
  await expect(heading(page, 'Atributos')).toBeVisible();
  for (const a of ATTRS) await page.getByRole('spinbutton', { name: `pontos em ${a}` }).fill('3');
  await page.getByRole('spinbutton', { name: 'pontos em Trunfo' }).fill('3');
  await next(page).click();

  // Do Magia até Contatos só há avisos: dá para avançar direto
  for (const step of ['Qualidades', 'Perícias', 'Recursos', 'Contatos', 'Revisão']) {
    await expect(next(page)).toHaveText(new RegExp(step));
    await next(page).click();
  }

  // Revisão
  await expect(page.getByText('Tudo certo com as regras.')).toBeVisible();
  await expect(heading(page, 'Agulha')).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Exportar JSON' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('agulha.json');
  const exported = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(exported).toMatchObject({ app: 'fixer-sr5', format: 1 });
  expect(exported.draft.concept).toMatchObject({ name: 'Mariana Kowalski', alias: 'Agulha', role: 'Samurai de rua' });
  expect(exported.draft.attributes.BOD.points).toBe(3);
});

test('a ficha continua lá depois de recarregar a página', async ({ page }) => {
  await page.getByPlaceholder('Ex.: Mariana Kowalski').fill('Persistente');
  await next(page).click();
  await expect(heading(page, 'Prioridades')).toBeVisible();

  await page.reload();
  await expect(heading(page, 'Prioridades')).toBeVisible();
  await page.getByRole('button', { name: '← Voltar' }).click();
  await expect(page.getByPlaceholder('Ex.: Mariana Kowalski')).toHaveValue('Persistente');
});

test('importa uma ficha exportada', async ({ page }) => {
  // Revisão só fica acessível com a ficha sem erros: entra com a ficha válida no storage.
  const fixture = JSON.parse(await readFile(FIXTURE, 'utf8'));
  await page.evaluate((d) => localStorage.setItem('fixer:sr5:draft', JSON.stringify({ draft: d, step: 9 })), {
    ...fixture.draft,
    concept: { name: 'Outra pessoa' },
  });
  await page.reload();
  await expect(heading(page, 'Outra pessoa')).toBeVisible();

  page.once('dialog', (d) => d.accept());
  await page.locator('input[type=file]').setInputFiles(FIXTURE);
  await expect(page.getByPlaceholder('Ex.: Agulha')).toHaveValue('Agulha');
});

test('arquivo inválido mostra erro e não troca a ficha', async ({ page }) => {
  const fixture = JSON.parse(await readFile(FIXTURE, 'utf8'));
  await page.evaluate((d) => localStorage.setItem('fixer:sr5:draft', JSON.stringify({ draft: d, step: 9 })), fixture.draft);
  await page.reload();

  await page.locator('input[type=file]').setInputFiles({
    name: 'lixo.json',
    mimeType: 'application/json',
    buffer: Buffer.from('isto não é json'),
  });
  await expect(page.getByText(/Arquivo inválido/)).toBeVisible();
  await expect(heading(page, 'Agulha')).toBeVisible();
});

test('"Nova ficha" apaga tudo depois de confirmar', async ({ page }) => {
  await page.getByPlaceholder('Ex.: Mariana Kowalski').fill('Vai sumir');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Nova ficha' }).click();
  await expect(page.getByPlaceholder('Ex.: Mariana Kowalski')).toHaveValue('');
});

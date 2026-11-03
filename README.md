# Criador de fichas — Shadowrun 5ª edição

Criador de personagens guiado para jogadores iniciantes de Shadowrun 5e, com
interface em português. Usa o sistema de **prioridades** do livro básico e toma
como referência de regras o [Chummer5a](https://github.com/chummer5a/chummer5a).

Stack: Next.js (App Router) + TypeScript + Tailwind. Sem backend: a ficha fica no
`localStorage` e pode ser exportada em JSON/PDF.

## Começando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Dados de regras

Os dados de jogo ficam em `data/sr5/*.json` e já vêm no repositório. Eles são
gerados a partir dos XMLs do Chummer5a:

```bash
git clone --depth 1 https://github.com/chummer5a/chummer5a.git ref/chummer5a
npm run data:build
```

- Por padrão só entra o livro básico (`SR5`). Para incluir outros livros, passe os
  códigos de `data/sr5/books.json`: `npm run data:build -- --books SR5,RF`.
- Para usar um clone em outro lugar: `npm run data:build -- --ref caminho/para/chummer5a/Chummer`.
- A pasta `ref/` não vai para o git.

| Arquivo | Conteúdo |
|---|---|
| `settings.json` | Constantes de criação (karma inicial, limites, custos de karma) |
| `priorities.json` | Tabela de prioridades A–E |
| `metatypes.json` | Metatipos, faixas de atributo, qualidades raciais |
| `qualities.json` | Qualidades positivas e negativas, requisitos e efeitos |
| `skills.json` | Perícias ativas, grupos, categorias, sugestões de conhecimento |
| `traditions.json`, `streams.json`, `spells.json`, `powers.json`, `complexforms.json`, `mentors.json` | Magia e Ressonância |
| `weapons.json`, `armor.json`, `gear.json`, `cyberware.json`, `bioware.json`, `lifestyles.json` | Equipamento |
| `contacts.json` | Arquétipos de contato |
| `books.json`, `meta.json` | Lista de livros e informações da geração |

Os tipos de todos esses arquivos estão em `src/lib/sr5/types.ts`.

## Como o app é organizado

O assistente tem 10 passos: Conceito, Prioridades, Metatipo, Atributos, Magia/Ressonância, Qualidades, Perícias,
Recursos, Contatos e Revisão. Erros bloqueiam o avanço; avisos (pontos sobrando etc.) só informam.

| Pasta | O que tem |
|---|---|
| `src/components/wizard` | Casca do assistente: progresso, navegação, painel de resumo, glossário |
| `src/components/steps` | Um componente por passo |
| `src/components/ui.tsx` | Peças comuns: botão "?", seletor numérico, cartões, lista de avisos |
| `src/content/help.ts` | Textos de ajuda e glossário (escritos por nós, não copiados dos livros) |
| `src/lib/store.ts` | Ficha em criação, salva no `localStorage` |

Na Revisão dá para exportar/importar a ficha em JSON e salvar em PDF pela janela de impressão do navegador.

## Motor de regras

`src/lib/sr5/rules` é TypeScript puro (sem React). `evaluate(rascunho)` devolve:

- pontos restantes de cada orçamento (atributos, especiais, perícias, conhecimento, contatos, karma, nuyen, pontos de poder…);
- valores derivados (limites, iniciativa, monitores de condição, Essência…);
- a lista de problemas, cada um com gravidade (`error` bloqueia o passo; `warning` e `info` não) e o passo do assistente onde se resolve;
- o que está disponível para escolher e, quando não está, o motivo.

O formato da ficha em criação está em `src/lib/sr5/character.ts`.

## Testes

```bash
npm test               # testes de unidade e de componentes (Vitest), uma vez
npm run test:watch     # o mesmo, rodando de novo a cada mudança
npm run test:coverage  # com relatório de cobertura em coverage/
npm run test:e2e       # ponta a ponta no navegador (Playwright)
npm run test:e2e:ui    # Playwright com a interface visual, bom para depurar
npm run test:all       # tipos + lint + unidade + ponta a ponta
```

Na primeira vez, baixe o navegador do Playwright: `npx playwright install chromium`.

| Camada | Onde | O que cobre |
| --- | --- | --- |
| Regras | `src/lib/sr5/rules/__tests__` | `evaluate()` com fichas montadas em código; casos conferidos à mão com o livro |
| Store e JSON | `src/lib/__tests__`, `src/lib/sr5/__tests__` | localStorage, fichas antigas, export/import e integridade dos dados gerados |
| Scripts de dados | `scripts/build-data/__tests__` | conversão do XML do Chummer, com XMLs pequenos em `fixtures/` |
| Componentes | `src/components/**/__tests__` | o assistente renderizado no jsdom com Testing Library |
| Ponta a ponta | `e2e/` | o app de verdade no Chromium: criar um personagem inteiro, recarregar, importar e exportar |

- Testes de unidade rodam em Node. Arquivos que precisam de DOM começam com `// @vitest-environment jsdom`.
- O E2E faz o build de produção e sobe na porta 3100, para não brigar com um `npm run dev` aberto.
- `e2e/fixtures/ficha-valida.json` é uma ficha completa usada pelo E2E e pelos testes de componente. Um teste
  de unidade garante que ela continua válida quando as regras mudam.
- A CI (`.github/workflows/testes.yml`) roda tudo a cada push na `main` e em cada pull request.

## Documentação

- `docs/fase1-investigacao.md` — mapa dos dados do Chummer5a e regras derivadas.

## Licença e atribuições

Veja [NOTICE.md](NOTICE.md). Os dados derivam do Chummer5a (GPL-3.0).

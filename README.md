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

## Documentação

- `docs/fase1-investigacao.md` — mapa dos dados do Chummer5a e regras derivadas.

## Licença e atribuições

Veja [NOTICE.md](NOTICE.md). Os dados derivam do Chummer5a (GPL-3.0).

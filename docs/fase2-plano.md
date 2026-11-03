# Fase 2 — Contas, fichas na nuvem, campanha e time

Hoje o Fixer é um assistente de criação que roda só no navegador (`localStorage`).
A fase 2 transforma ele num **companheiro de campanha**: o jogador tem conta,
várias fichas, acompanha a ficha durante o jogo, planeja a evolução do personagem
e vê como está o time.

## O que o jogador vai conseguir fazer

1. **Entrar com uma conta** (Google ou e-mail) e ter **várias fichas**.
2. **Criar a ficha** no assistente que já existe; ela salva sozinha no banco.
3. **Usar a ficha em jogo**: nuyen, karma, monitor de condição, inventário,
   com histórico de "ganhei 5.000¥ na missão X".
4. **Registrar a campanha**: diário de missões/sessões (o que aconteceu, recompensas,
   ganchos em aberto, NPCs).
5. **Planejar o personagem**: metas ("Agilidade 6", "comprar ciberolhos alfa",
   "vingar o contato morto"), com o custo em karma/nuyen calculado pelo motor de
   regras e quanto falta.
6. **Montar um time**: gerar um link de convite; quem abre entra no time com uma
   das suas fichas. Todos veem as fichas uns dos outros (só leitura) e um
   **painel do time** mostra papéis cobertos e faltando ("ninguém é decker",
   "Fulano está com Essência 1,2").

Mestre/campanha formal fica de fora por enquanto: o time é só entre jogadores.

## Stack

| Parte | Escolha | Por quê |
|---|---|---|
| Hospedagem | Vercel (plano Hobby) | Next.js nativo, preview por PR |
| Banco | Neon Postgres (Vercel Marketplace) | Postgres gerenciado, plano gratuito, variáveis de ambiente automáticas, um banco por preview |
| Acesso ao banco | Drizzle ORM + migrações | Tipado em TypeScript, leve, bom com Postgres e `jsonb` |
| Login | Clerk (Vercel Marketplace) | Login pronto (Google, e-mail), telas prontas, integra com `proxy.ts` do Next 16 |
| Escrita | Server Actions do Next | Sem API separada; validação no servidor |

Antes de codar: ler `node_modules/next/dist/docs/` (Next 16 tem mudanças, como
`middleware.ts` → `proxy.ts`).

## Modelo de dados

```
users            id (id do Clerk), display_name, created_at

characters       id, owner_id → users, name, status ('draft' | 'active' | 'retired'),
                 draft jsonb (o CharacterDraft atual, inteiro),
                 schema_version, created_at, updated_at

character_play   character_id (1:1), physical_damage, stun_damage,
                 notes, edge_spent ...         ← estado "em jogo"

ledger           id, character_id, kind ('nuyen' | 'karma'), amount (+/-),
                 reason, mission_id (opcional), created_at
                 → saldo = soma; dá o histórico de graça

missions         id, character_id, title, status ('planned' | 'active' | 'done'),
                 summary, notes, played_at

goals            id, character_id, title, description,
                 kind ('advancement' | 'gear' | 'story'),
                 target jsonb (ex.: { attr: 'AGI', rating: 6 }),
                 status, position

teams            id, name, owner_id → users, invite_code (aleatório, revogável)

team_members     team_id, character_id, joined_at
```

Pontos importantes:

- **A ficha continua sendo o `CharacterDraft` em `jsonb`.** O motor de regras e o
  assistente não mudam; só troca onde ele é guardado. `schema_version` +
  `normalizeDraft` já resolvem fichas antigas.
- **Quem entra no time é a ficha, não o usuário.** Um jogador pode ter fichas em
  times diferentes.
- **Permissão no servidor:** toda leitura/escrita checa se o usuário é dono da
  ficha, ou (só leitura) se a ficha está num time do qual ele participa.
  Anotações marcadas como privadas não aparecem pro time.

## Painel do time (papéis)

Calculado a partir das fichas com o motor de regras, sem o jogador preencher nada:

| Papel | Sinal na ficha |
|---|---|
| Mago / Adepto | talento mágico, MAG |
| Tecnomante | RES |
| Decker | Hacking, Cybercombat, Electronic Warfare, cyberdeck |
| Rigger | Pilot*, control rig, drones |
| Face | Negotiation, Con, Etiquette, Leadership, CHA |
| Samurai / combate | perícias de combate, armas, armadura |
| Tanque | BOD alto, armadura, monitor físico grande |

Também mostra Essência de cada um, papel declarado (`concept.role`) e alertas
("ninguém cura", "ninguém tem Perception alta").

## Fases de entrega

Cada fase termina com algo usável em produção.

### Fase 2.0 — Fundação
- Deploy na Vercel do app atual.
- Neon + Drizzle + primeira migração; Clerk com login e `proxy.ts` protegendo
  as rotas privadas.
- CI: migrações rodando nos previews (banco por branch do Neon).

### Fase 2.1 — Contas e várias fichas
- Tela "Minhas fichas" (criar, duplicar, apagar, abrir).
- Assistente salva no banco (autosave com debounce via Server Action), no lugar
  do `localStorage`.
- Na primeira entrada, se houver ficha no `localStorage`, oferece importar.
- Export JSON/PDF continua igual.

### Fase 2.2 — Ficha em jogo
- Botão "Finalizar criação" → ficha vira `active` (criação travada).
- Tela de jogo: nuyen e karma com histórico, monitor de condição, notas.
- Diário de missões, com recompensas lançadas no histórico.

### Fase 2.3 — Planejamento
- Metas por personagem, com ordem e status.
- Metas de avanço calculam o custo em karma (regras de avanço do SR5) e mostram
  quanto falta com o karma atual.

### Fase 2.4 — Time
- Criar time, gerar/revogar link de convite, entrar com uma ficha, sair.
- Ver fichas dos colegas (só leitura) e o painel do time.

### Depois (fora do escopo agora)
- Papel de mestre/campanha, atualização em tempo real, notificações,
  avanço de karma aplicado direto na ficha.

## Testes

- Vitest para permissões e cálculos (custo de metas, papéis do time).
- Playwright E2E com usuários de teste do Clerk e banco de branch do Neon.

## Decisões em aberto

1. O time vê **tudo** da ficha do colega (nuyen, equipamento) ou um resumo?
2. Dá pra usar o assistente **sem login** (e só pedir conta na hora de salvar)?
3. Uma ficha pode estar em **mais de um time** ao mesmo tempo?
4. Licença: manter o repositório público por causa da GPL dos dados do Chummer5a.

# Fase 1 — Investigação do Chummer5a

Referência: clone raso (sparse) em `ref/chummer5a` (commit HEAD de 2026-11-03), com `Chummer/data`, `Chummer/lang`, `Chummer/Backend` e `Chummer/Forms/Character Forms`.
`ref/` fica fora do código do app (vai no `.gitignore` e no `exclude` do tsconfig).

---

## 1. Arquivos a usar

| Arquivo | Para quê | Filtro "livro básico" |
|---|---|---|
| `data/books.xml` | Catálogo de livros (código → nome). Básico = `SR5` | — |
| `data/priorities.xml` | Tabela de prioridades A–E das 5 categorias | **não tem `<source>`**: filtrar indiretamente pelo metatipo/qualidade referenciada |
| `data/metatypes.xml` | Metatipos, limites de atributo, karma, qualidades raciais, bônus | `<source>SR5` |
| `data/skills.xml` | Perícias ativas, grupos, categorias, especializações, perícias de conhecimento sugeridas | ativas: `<source>SR5` (76). Conhecimento: sem source (são sugestões) |
| `data/qualities.xml` | Qualidades positivas/negativas, custo, limites, proibições | `<source>SR5` (96 de 803) |
| `data/contacts.xml` | Lista de arquétipos de contato (só nomes) | — |
| `data/traditions.xml` / `streams.xml` | Tradições (Hermética, Xamânica) e Fluxo do tecnomante | `SR5` (3 / 1) |
| `data/spells.xml`, `powers.xml`, `complexforms.xml`, `mentors.xml` | Magias (93), poderes de adepto (28), formas complexas (14), mentores (16) | `SR5` |
| `data/gear.xml`, `weapons.xml`, `armor.xml`, `cyberware.xml`, `bioware.xml`, `lifestyles.xml` | Equipamento (fase "recursos simples") | `SR5` |
| `data/settings.xml` (perfil **Standard**) | Constantes de criação: karma 25, limites, custos de karma, fórmulas de contatos/conhecimento | — |
| `lang/pt-br_data.xml` | **Traduções pt-BR dos nomes** (metatipos 283, qualidades 678, perícias 265 itens) | aproveitar onde `translated="True"`; resto traduzimos nós |

Observação importante: **o Chummer não guarda descrições** dos itens (só nome, livro e página). Todos os textos explicativos serão escritos por nós, como você pediu.

---

## 2. Estrutura dos dados (o que importa)

### priorities.xml
- 5 categorias: `Heritage` (Metatipo), `Talent` (Magia/Ressonância), `Attributes`, `Skills`, `Resources`.
- 3 tabelas de jogo (`Standard`, `Prime Runner`, `Street Level`) — só **Recursos** muda entre elas.
- Cada letra de **Metatipo** lista metatipos com `value` = **pontos de atributo especial** e `karma` extra (metavariantes).

| Letra | Metatipo (pontos especiais, só básico) | Atributos | Perícias / Grupos | Recursos (Standard) |
|---|---|---|---|---|
| A | Humano 9, Elfo 8, Anão 7, Ork 7, Troll 5 | 24 | 46 / 10 | 450.000¥ |
| B | Humano 7, Elfo 6, Anão 4, Ork 4, Troll 0 | 20 | 36 / 5 | 275.000¥ |
| C | Humano 5, Elfo 3, Anão 1, Ork 0 | 16 | 28 / 2 | 140.000¥ |
| D | Humano 3, Elfo 0 | 14 | 22 / 0 | 50.000¥ |
| E | Humano 1 | 12 | 18 / 0 | 6.000¥ |

- **Talent** (só os do básico; Aware/Explorer/Enchanter/Apprentice são do *Forbidden Arcana* e A.I. do *Data Trails*):

| Letra | Opções |
|---|---|
| A | Mago 6 Mag + 10 magias + 2 perícias mágicas nível 5 · Adepto Místico (idem) · Tecnomante 6 Res + 7 formas complexas + 3 perícias de ressonância nível 5 |
| B | Adepto 6 Mag + 1 perícia ativa nível 4 · Mago 4/7 magias + 2 mágicas nv 4 · Ad. Místico 4/7 · Mago Aspectado 5 Mag + 1 grupo mágico nv 4 · Tecnomante 4/4 formas + 3 perícias nv 4 |
| C | Adepto 4 + 1 perícia nv 2 · Mago 3/5 · Ad. Místico 3/5 · Aspectado 3 + 1 grupo nv 2 · Tecnomante 3/3 + 3 perícias nv 2 |
| D | Adepto 2 · Aspectado 2 |
| E | Mundano |

Campos: `magic`/`resonance`, `spells`/`cfp`, `skillqty`+`skillval`+`skilltype` (`magic`, `resonance`, `specific`, ou um xpath para "qualquer perícia ativa não mágica" no adepto), `skillgroupqty`+`skillgroupval`+`skillgroupchoices` (aspectado: Conjuração/Encantamento/Feitiçaria), `forbidden`/`required` por metatipo.

### metatypes.xml
Por metatipo: `karma` (custo no Point Buy, não usado aqui), `{bod,agi,rea,str,cha,int,log,wil,edg,mag,res,ess}{min,max,aug}`, `ini{min,max}`, `walk/run/sprint`, `qualities/positive|negative` (ex.: Elfo → Visão na Penumbra; Troll → Visão Térmica), `bonus` (Troll: +1 armadura, +1 alcance, estilo de vida +100%). Metavariantes ficam aninhadas em `metavariants` — **todas são do Run Faster (RF)**, nenhuma é do básico.

### skills.xml
- Perícia: `name`, `attribute` (BOD/AGI/…/MAG/RES), `category` (Combate, Física, Social, Mágica, Pseudo-Mágica, Ressonância, Técnica, Veículo), `default` (pode usar sem treino), `skillgroup`, `specs[]`, `exotic`.
- 15 grupos de perícia. Conhecimento: categorias Acadêmico, Interesse, Idioma, Profissional, Rua.

### qualities.xml
`name`, `karma` (positivo = custa, negativo = dá karma), `category` (Positive/Negative), `limit` (vezes que pode pegar), `forbidden`/`required` (outras qualidades, metatipo, magia ativada…), `bonus` (mini-DSL de efeitos: `specificattribute`, `selectskill`, `enableattribute`, etc.), `onlyprioritygiven` (Mago, Adepto, Tecnomante… só vêm via prioridade, não se compram), `contributetolimit` (se conta no teto de 25).

---

## 3. Regras derivadas encontradas no C#

Fontes: `Backend/Characters/Character.cs`, `Backend/Static/Extensions/*`, `Forms/Character Forms/CharacterCreate.cs` (validação), `data/settings.xml` (Standard).
Arredondamento: o Chummer arredonda divisões **para cima** (`DivAwayFromZero`) e a Essência também para cima (`StandardRound` = teto).

**Limites**
- Físico = ⌈(FOR×2 + COR + REA) / 3⌉
- Mental = ⌈(LOG×2 + INT + VON) / 3⌉
- Social = ⌈(CAR×2 + VON + ⌈Essência⌉) / 3⌉

**Iniciativa**
- Física = REA + INT + 1D6 (dados extras somam por bônus, máximo 5D6)
- Astral = INT×2 + 3D6 · Matriz RA = REA + INT + 1D6 · Matriz VR fria = Processamento + INT + 3D6 · quente = + 4D6

**Monitores de condição**
- Físico = 8 + ⌈COR/2⌉ · Atordoamento = 8 + ⌈VON/2⌉ · Excedente = COR + 1
- Penalidade por ferimento: −1 a cada 3 caixas marcadas (`CMThreshold = 3`)

**Atributos secundários**: Compostura = VON + CAR · Julgar Intenções = INT + CAR · Memória = LOG + VON · Levantar/Carregar = FOR + COR

**Essência**: 6 − soma do custo de essência de ciber/bioware. Abaixo de 0 é inválido. Magia/Ressonância máxima cai junto com a Essência perdida.

**Criação por prioridades (perfil Standard)**
- Prioridades A–E usadas uma vez cada.
- Karma inicial: **25**.
- Qualidades: no máximo **25** de karma em positivas e **25** em negativas (as do metatipo/prioridade não contam).
- Karma → ¥: até **10** karma, a **2.000¥** cada.
- Atributos: metatipo dá o mínimo de graça; pontos de atributo só em atributos físicos/mentais; **só 1 atributo** pode estar no máximo natural (`MaxNumberMaxAttributesCreate = 1`).
- Pontos especiais: só em Edge, Magia ou Ressonância. Magia/Ressonância partem do valor dado pelo Talent.
- Karma em atributo: novo valor × 5.
- Perícias: nível máximo **6** na criação (7 com Aptidão); especialização custa 1 ponto de perícia (ou 7 de karma); 1 especialização por perícia; grupo comprado com pontos de grupo não pode ter especialização.
- Karma em perícia: nova ativa = 2 × nível; grupo = 5 × nível; conhecimento = 1 × nível.
- Conhecimento grátis: (INT + LOG) × 2 pontos. Idioma nativo grátis.
- Contatos grátis: CAR × 3 pontos (Conexão + Lealdade); acima disso, 1 karma por ponto. O Chummer avisa se um contato passa de **7 pontos**.
- Equipamento: disponibilidade máxima **12**; ciberware beta/delta proibido. ¥ restante não pode ser negativo.
- Magos precisam escolher Tradição; tecnomantes, Fluxo.
- Magias: 5 karma cada além das grátis. Formas complexas: 4 karma cada. Adeptos: pontos de poder = Magia.
- Karma que sobra: até **7** passa para o jogo.

Mensagens de validação do Chummer que viram nossos "erros": excesso de pontos (atributo, especial, perícia, grupo, conhecimento), excesso de karma em qualidades, mais de 1 atributo no máximo, ¥ negativo, Essência negativa, sem tradição/fluxo, poderes acima da Magia, disponibilidade acima de 12.

---

## 4. Proposta de modelo de dados (TypeScript)

### 4.1 Dados estáticos (gerados dos XMLs → `/data/sr5/*.json`)

```ts
type BookCode = 'SR5' | (string & {});           // pronto para outros livros
type AttrKey = 'BOD'|'AGI'|'REA'|'STR'|'CHA'|'INT'|'LOG'|'WIL'|'EDG'|'MAG'|'RES'|'ESS';
type PriorityLetter = 'A'|'B'|'C'|'D'|'E';
type PriorityCategory = 'metatype'|'talent'|'attributes'|'skills'|'resources';

interface Sourced { id: string; source: BookCode; page: number; }
interface Named { name: string; namePt?: string; }  // namePt vem do pt-br_data.xml

interface AttributeRange { min: number; max: number; aug: number; }

interface Metatype extends Sourced, Named {
  category: 'Metahuman' | 'Metasapient' | 'Shapeshifter';
  attributes: Record<AttrKey, AttributeRange>;
  movement: { walk: number; run: number; sprint: number };
  racialQualities: string[];                  // ids de Quality
  bonus: { armor?: number; reach?: number; lifestyleCostPct?: number };
  metavariants: Metavariant[];                // vazio no básico
}
interface Metavariant extends Sourced, Named { parentId: string; attributes?: Partial<Record<AttrKey, AttributeRange>>; }

interface TalentOption {
  key: 'magician'|'mysticAdept'|'adept'|'aspected'|'technomancer'|'mundane';
  qualityId?: string;
  magic?: number; resonance?: number;
  freeSpells?: number; freeComplexForms?: number;
  freeSkills?: { count: number; rating: number; kind: 'magic'|'resonance'|'nonMagicActive'|'specific'; choices?: string[] };
  freeSkillGroup?: { count: number; rating: number; choices: string[] };
  forbiddenMetatypes?: string[]; requiredMetatypeCategory?: string;
}

interface PriorityRow {
  letter: PriorityLetter;
  metatypes: { metatypeId: string; specialPoints: number; karmaCost: number }[];
  talents: TalentOption[];
  attributePoints: number;
  skillPoints: number; skillGroupPoints: number;
  resources: Record<'standard'|'primeRunner'|'streetLevel', number>;
}

interface Skill extends Sourced, Named {
  attribute: AttrKey; category: SkillCategory; group?: string;
  canDefault: boolean; exotic: boolean; specs: string[];
}
interface SkillGroup extends Named { id: string; skillIds: string[]; }

interface Quality extends Sourced, Named {
  kind: 'positive'|'negative'; karma: number; maxRating: number;
  countsTowardLimit: boolean; onlyFromPriority: boolean;
  forbids: Requirement[]; requires: Requirement[];
  effects: Effect[];                          // subset tratado do <bonus>; o resto vira "efeito narrativo"
}
type Requirement =
  | { type: 'quality'; id: string } | { type: 'metatype'; id: string }
  | { type: 'magicEnabled' } | { type: 'resonanceEnabled' };
type Effect =
  | { type: 'attributeMax'; attr: AttrKey; delta: number }
  | { type: 'skillMax'; delta: number; choice: 'skill' }
  | { type: 'limit'; limit: 'physical'|'mental'|'social'; delta: number }
  | { type: 'conditionMonitor'; track: 'physical'|'stun'; delta: number }
  | { type: 'note'; text: string };

interface RulesConfig {                        // perfil "Standard" do settings.xml
  books: BookCode[]; startingKarma: 25; qualityKarmaLimit: 25;
  maxKarmaToNuyen: 10; nuyenPerKarma: 2000; maxKarmaCarryover: 7;
  maxAvailability: 12; maxSkillRating: 6; maxAttributesAtMax: 1;
  karmaCost: { attributeMultiplier: 5; newActiveSkill: 2; activeSkillMultiplier: 2; skillGroupMultiplier: 5; knowledgeMultiplier: 1; specialization: 7; spell: 5; complexForm: 4; contactPoint: 1 };
}
```

### 4.2 Estado da ficha (salvo no localStorage / exportado em JSON)

```ts
interface CharacterDraft {
  schemaVersion: 1;
  concept: { name: string; alias?: string; role?: RoleKey; notes?: string };
  settings: { table: 'standard'; books: BookCode[] };
  priorities: Partial<Record<PriorityCategory, PriorityLetter>>;
  metatypeId?: string; metavariantId?: string;
  talent?: TalentOption['key'];
  attributes: Partial<Record<AttrKey, { points: number; karma: number }>>; // acima do mínimo
  special: { EDG: number; MAG: number; RES: number };
  magic?: { traditionId?: string; mentorId?: string; spellIds: string[]; powerLevels: Record<string, number>; complexFormIds: string[]; freeSkillPicks: string[]; freeGroupPick?: string };
  qualities: { id: string; rating: number; choice?: string }[];
  skills: { id: string; rating: number; fromPoints: number; spec?: string }[];
  skillGroups: { id: string; rating: number }[];
  knowledge: { name: string; category: KnowledgeCategory; rating: number; native?: boolean }[];
  contacts: { name: string; archetype?: string; connection: number; loyalty: number }[];
  gear: { itemId: string; qty: number }[];
  karmaToNuyen: number;
}
```

### 4.3 Saída do motor de regras (puro, sem React)

```ts
interface RulesResult {
  budgets: Record<'attributes'|'special'|'skills'|'skillGroups'|'knowledge'|'contacts'|'karma'|'nuyen'|'powerPoints'|'freeSpells',
                  { total: number; spent: number; remaining: number }>;
  attributes: Record<AttrKey, { min: number; max: number; value: number }>;
  derived: {
    limits: { physical: number; mental: number; social: number };
    initiative: { base: number; dice: number }; astralInitiative?: { base: number; dice: number };
    monitors: { physical: number; stun: number; overflow: number };
    essence: number; composure: number; judgeIntentions: number; memory: number; liftCarry: number;
  };
  issues: { severity: 'error'|'warning'|'info'; code: string; step: WizardStep; message: string; path?: string }[];
  availability: { [optionId: string]: { ok: boolean; reason?: string } }; // ex.: "Troll exige prioridade A ou B em Metatipo"
}
```

---

## 5. Decisões que preciso de você

1. **Metavariantes** — no Chummer todas vêm do *Run Faster*, nenhuma do básico. Filtrando só o básico, elas somem. Deixo de fora agora (estrutura pronta) ou incluo o RF só para metavariantes?
2. **Adepto Místico: pontos de poder** — o Chummer cobra **5 karma por ponto de poder** na criação (`karmamysadpp`). Uso essa regra do Chummer ou outra da sua mesa?
3. **Tabelas de jogo** — o XML tem Standard, Street Level e Prime Runner (só Recursos muda). Começo só com **Standard** e deixo as outras para depois?
4. **Nomes em pt-BR** — o `pt-br_data.xml` do Chummer (GPL-3.0) já traduz boa parte dos nomes. Uso essas traduções como base (com atribuição) e completo o que faltar?
5. **Pasta do projeto** — sugiro o app na raiz `D:\dev\fixer` com `ref/` ignorada pelo git. Prefere o app numa subpasta (ex.: `D:\dev\fixer\app`)?

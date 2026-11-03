/**
 * Estado do assistente: a ficha em criação e o passo atual.
 * Fica no localStorage do navegador; sem backend.
 * Uso nos componentes: `useWizard()` (React useSyncExternalStore).
 */
import { useSyncExternalStore } from 'react';
import { createEmptyDraft, DRAFT_SCHEMA_VERSION, type CharacterDraft } from './sr5/character';

const KEY = 'fixer:sr5:draft';

export interface WizardState {
  draft: CharacterDraft;
  step: number;
}

let state: WizardState | null = null;
const listeners = new Set<() => void>();

/** Completa campos que faltam (fichas salvas por versões antigas). */
export function normalizeDraft(raw: unknown): CharacterDraft {
  const empty = createEmptyDraft();
  if (!raw || typeof raw !== 'object') return empty;
  const d = raw as Partial<CharacterDraft>;
  if (d.schemaVersion !== DRAFT_SCHEMA_VERSION) throw new Error('Versão de ficha não suportada.');
  return {
    ...empty,
    ...d,
    concept: { ...empty.concept, ...d.concept },
    attributes: { ...empty.attributes, ...d.attributes },
    special: { ...empty.special, ...d.special },
    magic: { ...empty.magic, ...d.magic },
  };
}

function load(): WizardState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { draft: unknown; step?: number };
      return { draft: normalizeDraft(parsed.draft), step: parsed.step ?? 0 };
    }
  } catch {
    /* ficha corrompida ou storage bloqueado: começa do zero */
  }
  return { draft: createEmptyDraft(), step: 0 };
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage cheio ou bloqueado: segue só em memória */
  }
}

function set(next: WizardState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): WizardState {
  if (!state) state = load();
  return state;
}

/** No servidor não há localStorage: a tela mostra um carregando. */
const getServerSnapshot = (): WizardState | null => null;

export function useWizard(): WizardState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Altera a ficha. `fn` recebe uma cópia e pode mutá-la. */
export function updateDraft(fn: (d: CharacterDraft) => void) {
  const cur = getSnapshot();
  const draft = structuredClone(cur.draft);
  fn(draft);
  set({ ...cur, draft });
}

export function setStep(step: number) {
  set({ ...getSnapshot(), step });
}

export function replaceDraft(draft: CharacterDraft) {
  set({ draft, step: 0 });
}

export function resetDraft() {
  set({ draft: createEmptyDraft(), step: 0 });
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

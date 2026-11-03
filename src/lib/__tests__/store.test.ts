// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmptyDraft, DRAFT_SCHEMA_VERSION } from '../sr5/character';

const KEY = 'fixer:sr5:draft';

/** A store guarda estado no módulo: cada teste carrega uma cópia nova. */
async function freshStore() {
  vi.resetModules();
  return import('../store');
}

const saved = () => JSON.parse(localStorage.getItem(KEY)!);

beforeEach(() => localStorage.clear());

describe('normalizeDraft', () => {
  it('lixo vira ficha vazia', async () => {
    const { normalizeDraft } = await freshStore();
    expect(normalizeDraft(null)).toEqual(createEmptyDraft());
    expect(normalizeDraft('texto')).toEqual(createEmptyDraft());
  });

  it('completa campos que faltam em fichas antigas', async () => {
    const { normalizeDraft } = await freshStore();
    const d = normalizeDraft({ schemaVersion: DRAFT_SCHEMA_VERSION, concept: { name: 'Agulha' } });
    expect(d.concept.name).toBe('Agulha');
    expect(d.attributes.BOD).toEqual({ points: 0, karma: 0 });
    expect(d.magic.spellIds).toEqual([]);
    expect(d.contacts).toEqual([]);
  });

  it('mantém o que já existe nos objetos aninhados', async () => {
    const { normalizeDraft } = await freshStore();
    const d = normalizeDraft({
      schemaVersion: DRAFT_SCHEMA_VERSION,
      attributes: { BOD: { points: 4, karma: 1 } },
    });
    expect(d.attributes.BOD).toEqual({ points: 4, karma: 1 });
    expect(d.attributes.AGI).toEqual({ points: 0, karma: 0 });
  });

  it('recusa versão de ficha desconhecida', async () => {
    const { normalizeDraft } = await freshStore();
    expect(() => normalizeDraft({ schemaVersion: 999 })).toThrow('Versão de ficha não suportada.');
  });
});

describe('carregar do localStorage', () => {
  it('sem nada salvo, começa vazio no passo 0', async () => {
    const { getStateForTests } = await storeWithSnapshot();
    expect(getStateForTests()).toEqual({ draft: createEmptyDraft(), step: 0 });
  });

  it('lê a ficha e o passo salvos', async () => {
    const draft = { ...createEmptyDraft(), concept: { name: 'Agulha' } };
    localStorage.setItem(KEY, JSON.stringify({ draft, step: 3 }));
    const { getStateForTests } = await storeWithSnapshot();
    expect(getStateForTests()).toEqual({ draft, step: 3 });
  });

  it('JSON corrompido não quebra: começa do zero', async () => {
    localStorage.setItem(KEY, '{não é json');
    const { getStateForTests } = await storeWithSnapshot();
    expect(getStateForTests()).toEqual({ draft: createEmptyDraft(), step: 0 });
  });
});

describe('alterações', () => {
  it('updateDraft salva no localStorage', async () => {
    const { updateDraft } = await freshStore();
    updateDraft((d) => {
      d.concept.name = 'Agulha';
    });
    expect(saved().draft.concept.name).toBe('Agulha');
  });

  it('updateDraft trabalha numa cópia (não muta o estado anterior)', async () => {
    const { updateDraft, getStateForTests } = await storeWithSnapshot();
    const before = getStateForTests().draft;
    updateDraft((d) => {
      d.attributes.BOD.points = 5;
    });
    expect(before.attributes.BOD.points).toBe(0);
    expect(getStateForTests().draft.attributes.BOD.points).toBe(5);
  });

  it('setStep, replaceDraft e resetDraft', async () => {
    const { setStep, replaceDraft, resetDraft } = await freshStore();
    setStep(4);
    expect(saved().step).toBe(4);

    const other = { ...createEmptyDraft(), concept: { name: 'Outro' } };
    replaceDraft(other);
    expect(saved()).toEqual({ draft: other, step: 0 });

    resetDraft();
    expect(saved()).toEqual({ draft: createEmptyDraft(), step: 0 });
  });

  it('uid gera ids curtos e diferentes', async () => {
    const { uid } = await freshStore();
    const ids = new Set(Array.from({ length: 50 }, uid));
    expect(ids.size).toBe(50);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]{1,8}$/);
  });
});

/** Lê o estado atual pela mesma via que o React usa (useSyncExternalStore). */
async function storeWithSnapshot() {
  const store = await freshStore();
  const { renderHook } = await import('@testing-library/react');
  const getStateForTests = () => renderHook(() => store.useWizard()).result.current!;
  return { ...store, getStateForTests };
}

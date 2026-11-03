'use server';

import { refresh } from 'next/cache';
import { InputError } from '@/lib/sr5/play';
import { NotFoundError } from '@/server/characters';
import {
  addLedgerEntry,
  createMission,
  deleteLedgerEntry,
  deleteMission,
  finalizeCharacter,
  setDamage,
  setPlayNotes,
  updateMission,
} from '@/server/play';

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Erros de regra/validação viram mensagem na tela; o resto vai pro log. */
async function run(fn: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await fn();
    refresh();
    return { ok: true };
  } catch (e) {
    if (e instanceof InputError || e instanceof NotFoundError) return { ok: false, error: e.message };
    console.error('Falha na ficha em jogo', e);
    return { ok: false, error: 'Não deu para salvar agora. Tente de novo.' };
  }
}

export async function finalizeCharacterAction(id: string) {
  return run(() => finalizeCharacter(id));
}

export async function addLedgerEntryAction(
  id: string,
  input: { kind: unknown; amount: unknown; reason: unknown; missionId?: unknown },
) {
  return run(() => addLedgerEntry(id, input));
}

export async function deleteLedgerEntryAction(id: string, entryId: string) {
  return run(() => deleteLedgerEntry(id, entryId));
}

export async function setDamageAction(id: string, physical: unknown, stun: unknown) {
  return run(() => setDamage(id, physical, stun));
}

export async function setPlayNotesAction(id: string, notes: unknown) {
  return run(() => setPlayNotes(id, notes));
}

export async function createMissionAction(id: string, input: { title: unknown; playedOn?: unknown }) {
  return run(() => createMission(id, input));
}

export async function updateMissionAction(
  id: string,
  missionId: string,
  input: { title?: unknown; status?: unknown; notes?: unknown; playedOn?: unknown },
) {
  return run(() => updateMission(id, missionId, input));
}

export async function deleteMissionAction(id: string, missionId: string) {
  return run(() => deleteMission(id, missionId));
}

/**
 * Junta todos os JSONs de /data/sr5 num único objeto tipado.
 * O motor de regras recebe esse objeto como parâmetro (facilita testes e
 * permite trocar a lista de livros no futuro).
 */
import type {
  AdeptPower,
  Armor,
  Augmentation,
  Book,
  ComplexForm,
  ContactArchetype,
  CreationSettings,
  DataMeta,
  GearItem,
  Lifestyle,
  Mentor,
  Metatype,
  PriorityData,
  Quality,
  SkillData,
  Spell,
  Tradition,
  Weapon,
} from './types';

import armor from '../../../data/sr5/armor.json';
import bioware from '../../../data/sr5/bioware.json';
import books from '../../../data/sr5/books.json';
import complexforms from '../../../data/sr5/complexforms.json';
import contacts from '../../../data/sr5/contacts.json';
import cyberware from '../../../data/sr5/cyberware.json';
import gear from '../../../data/sr5/gear.json';
import lifestyles from '../../../data/sr5/lifestyles.json';
import mentors from '../../../data/sr5/mentors.json';
import meta from '../../../data/sr5/meta.json';
import metatypes from '../../../data/sr5/metatypes.json';
import powers from '../../../data/sr5/powers.json';
import priorities from '../../../data/sr5/priorities.json';
import qualities from '../../../data/sr5/qualities.json';
import settings from '../../../data/sr5/settings.json';
import skills from '../../../data/sr5/skills.json';
import spells from '../../../data/sr5/spells.json';
import streams from '../../../data/sr5/streams.json';
import traditions from '../../../data/sr5/traditions.json';
import weapons from '../../../data/sr5/weapons.json';

export interface Sr5Data {
  meta: DataMeta;
  books: Book[];
  settings: CreationSettings;
  priorities: PriorityData;
  metatypes: Metatype[];
  qualities: Quality[];
  skills: SkillData;
  contacts: ContactArchetype[];
  traditions: Tradition[];
  streams: Tradition[];
  spells: Spell[];
  powers: AdeptPower[];
  complexForms: ComplexForm[];
  mentors: Mentor[];
  lifestyles: Lifestyle[];
  weapons: Weapon[];
  armor: Armor[];
  gear: GearItem[];
  cyberware: Augmentation[];
  bioware: Augmentation[];
}

export const sr5Data: Sr5Data = {
  meta: meta as DataMeta,
  books: books as Book[],
  settings: settings as CreationSettings,
  priorities: priorities as unknown as PriorityData,
  metatypes: metatypes as unknown as Metatype[],
  qualities: qualities as unknown as Quality[],
  skills: skills as unknown as SkillData,
  contacts: contacts as ContactArchetype[],
  traditions: traditions as Tradition[],
  streams: streams as Tradition[],
  spells: spells as Spell[],
  powers: powers as AdeptPower[],
  complexForms: complexforms as ComplexForm[],
  mentors: mentors as Mentor[],
  lifestyles: lifestyles as Lifestyle[],
  weapons: weapons as unknown as Weapon[],
  armor: armor as unknown as Armor[],
  gear: gear as unknown as GearItem[],
  cyberware: cyberware as unknown as Augmentation[],
  bioware: bioware as unknown as Augmentation[],
};

/** Nome para exibir: pt-BR quando houver, senão o original. */
export function label(x: { name: string; namePt?: string }): string {
  return x.namePt ?? x.name;
}

'use client';
import { useStore } from './store';

export type Settings = {
  ownerName: string;
  assistantName: string;
  baseCurrency: string;
  leadDays: number;
  voiceReplies: boolean;
  hideBalances: boolean;
  home: Record<string, boolean>;
  share: Record<string, boolean>;
};

export const HOME_WIDGETS: [string, string][] = [
  ['brief', 'Daily briefing'],
  ['priorities', "Today's priorities"],
  ['calendar', 'Calendar'],
  ['inbox', 'Important inbox'],
  ['waiting', 'Waiting room'],
  ['goals', 'Goal progress'],
  ['business', 'Business pulse'],
  ['money', 'Money snapshot'],
  ['health', 'Health and routine'],
  ['quick', 'Quick actions'],
];

export const SHARE_AREAS: [string, string, boolean][] = [
  ['tasks', 'Tasks and checklists', true],
  ['goals', 'Goals and journal titles', true],
  ['business', 'Business workspaces', true],
  ['education', 'Education', true],
  ['health', 'Health and routine', false],
  ['finance', 'Personal finance and investments', false],
];

export const DEFAULTS: Settings = {
  ownerName: 'Kene',
  assistantName: 'Jarvis',
  baseCurrency: 'NGN',
  leadDays: 2,
  voiceReplies: false,
  hideBalances: false,
  home: Object.fromEntries(HOME_WIDGETS.map(([k]) => [k, true])),
  share: Object.fromEntries(SHARE_AREAS.map(([k, , d]) => [k, d])),
};

export function useSettings(): [Settings, (p: Partial<Settings>) => void] {
  const [s, set] = useStore<Partial<Settings>>('settings', {});
  const merged: Settings = { ...DEFAULTS, ...s, home: { ...DEFAULTS.home, ...(s.home ?? {}) }, share: { ...DEFAULTS.share, ...(s.share ?? {}) } };
  return [merged, (p) => set((prev) => ({ ...prev, ...p }))];
}

import type { Row } from './store';

export type Priority = 'high' | 'normal' | 'low';
export type Task = Row & {
  title: string;
  area: string; // 'personal' | 'school' | 'health' | 'business:<slug>'
  priority: Priority;
  due?: string;
  today?: boolean;
  done: boolean;
  doneAt?: string;
  notes?: string;
};
export type Goal = Row & { title: string; horizon: 'annual' | '90day' | 'long'; area: string; progress: number; next?: string; due?: string };
export type Journal = Row & { text: string; kind: string; date: string };
export type Waiting = Row & { what: string; who: string; asked: string; expected?: string; area?: string; resolved?: boolean };
export type CalEvent = Row & { title: string; date: string; time?: string; area?: string };
export type Account = Row & { name: string; currency: string; kind: string; balance: number; status: string; scope: string };
export type Txn = Row & { date: string; desc: string; amount: number; currency: string; type: 'income' | 'expense'; category: string; scope: string; accountId?: string };
export type SavingsGoal = Row & { name: string; target: number; saved: number; currency: string; deadline?: string };
export type Bill = Row & { name: string; amount: number; currency: string; due: string; recurring: string; paid: boolean };
export type Habit = Row & { name: string; days: string[] };

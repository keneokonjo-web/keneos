'use client';
import { readKey, uid, writeKey, logActivity } from './store';
import type { Account, Txn } from './types';

export const CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR', 'CAD', 'GHS', 'ZAR', 'KES', 'AED', 'CNY', 'JPY'];
export const SYMBOL: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€', CAD: 'C$', GHS: 'GH₵', ZAR: 'R', KES: 'KSh', AED: 'AED ', CNY: '¥', JPY: '¥' };
export const money = (n: number, cur: string, digits = 2) => `${n < 0 ? '-' : ''}${SYMBOL[cur] ?? cur + ' '}${Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export function addTxn(t: Omit<Txn, 'id' | 'createdAt'>) {
  const row: Txn = { ...t, id: uid(), createdAt: new Date().toISOString() };
  writeKey('txns', [row, ...readKey<Txn[]>('txns', [])]);
  if (t.accountId) {
    const accts = readKey<Account[]>('accounts', []);
    writeKey('accounts', accts.map((a) => (a.id === t.accountId ? { ...a, balance: a.balance + (t.type === 'income' ? t.amount : -t.amount) } : a)));
  }
  logActivity(`${t.type === 'income' ? 'Logged income' : 'Logged expense'}: ${t.desc || t.category} (${money(t.amount, t.currency)})`, 'money', '/finance');
}

export function removeTxn(id: string) {
  const txns = readKey<Txn[]>('txns', []);
  const t = txns.find((x) => x.id === id);
  if (!t) return;
  writeKey('txns', txns.filter((x) => x.id !== id));
  if (t.accountId) {
    const accts = readKey<Account[]>('accounts', []);
    writeKey('accounts', accts.map((a) => (a.id === t.accountId ? { ...a, balance: a.balance - (t.type === 'income' ? t.amount : -t.amount) } : a)));
  }
}

export type Rates = { base: string; rates: Record<string, number>; updated: string } | null;
export function convert(amount: number, from: string, to: string, rates: Rates): number | null {
  if (from === to) return amount;
  if (!rates?.rates[from] || !rates.rates[to]) return null;
  return (amount / rates.rates[from]) * rates.rates[to];
}

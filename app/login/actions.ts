'use server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE, SESSION_DAYS, signSession } from '@/lib/auth';
import { hashPassword, newSecret, verifyPassword } from '@/lib/password';

export type LoginState = { error?: string; email?: string; name?: string; setup?: { email: string; name: string; hash: string; secret: string } };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function signIn(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const { OWNER_EMAIL, OWNER_PASSWORD_HASH, AUTH_SECRET } = process.env;
  if (!OWNER_EMAIL || !OWNER_PASSWORD_HASH || !AUTH_SECRET) return { error: 'This OS has not been set up yet.' };
  const ok = email === OWNER_EMAIL.trim().toLowerCase() && verifyPassword(password, OWNER_PASSWORD_HASH);
  if (!ok) {
    await wait(700);
    return { error: 'Email or password is incorrect.', email };
  }
  const token = await signSession(email, AUTH_SECRET);
  const https = (await headers()).get('x-forwarded-proto') === 'https' || Boolean(process.env.VERCEL);
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: https, sameSite: 'lax', path: '/', maxAge: SESSION_DAYS * 86400 });
  redirect('/');
}

// First-run only. Nothing is stored: this produces the values you paste into Vercel as
// environment variables. It refuses to run once the OS is configured.
export async function createAccount(_: LoginState, form: FormData): Promise<LoginState> {
  if (process.env.OWNER_PASSWORD_HASH) return { error: 'An account already exists. Sign in instead.' };
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');
  if (!name || !email.includes('@')) return { error: 'Enter your name and a valid email.', name, email };
  if (password.length < 8 || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) return { error: 'Password must be at least 8 characters, including a number and a special character.', name, email };
  if (password !== confirm) return { error: 'Passwords do not match.', name, email };
  return { setup: { name, email, hash: hashPassword(password), secret: newSecret() } };
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
  redirect('/login');
}

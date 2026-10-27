import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const N = 16384;
export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N });
  return `scrypt.${N}.${salt.toString('base64url')}.${hash.toString('base64url')}`;
}
export function verifyPassword(password: string, stored: string) {
  const [scheme, n, salt, hash] = stored.split('.');
  if (scheme !== 'scrypt' || !n || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = scryptSync(password, Buffer.from(salt, 'base64url'), expected.length, { N: Number(n) });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function newSecret() {
  return randomBytes(32).toString('base64url');
}

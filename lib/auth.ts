// Edge-safe session signing (Web Crypto). Used by middleware and server actions.
const enc = new TextEncoder();
export const COOKIE = 'kos_session';
export const SESSION_DAYS = 30;

function b64url(buf: ArrayBuffer | Uint8Array) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string) {
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
  return atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
}
async function key(secret: string) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(email: string, secret: string) {
  const payload = b64url(enc.encode(JSON.stringify({ e: email, x: Date.now() + SESSION_DAYS * 86400000 })));
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(payload));
  return `${payload}.${b64url(sig)}`;
}

export async function verifySession(token: string | undefined, secret: string | undefined) {
  if (!token || !secret) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(payload));
  if (b64url(expected) !== sig) return null;
  try {
    const data = JSON.parse(fromB64url(payload)) as { e: string; x: number };
    if (data.x < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

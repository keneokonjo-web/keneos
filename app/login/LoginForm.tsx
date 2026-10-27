'use client';
import { useActionState, useState } from 'react';
import { createAccount, signIn, type LoginState } from './actions';

export function LoginForm({ configured }: { configured: boolean }) {
  const [mode, setMode] = useState<'signin' | 'create'>(configured ? 'signin' : 'create');
  return mode === 'signin' ? <SignIn configured={configured} onCreate={() => setMode('create')} /> : <Create configured={configured} onBack={() => setMode('signin')} />;
}

function PwField({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="lf">
      <label htmlFor={name}>{label} <i>*</i></label>
      <div className="lf-pw">
        <input id={name} name={name} type={show ? 'text' : 'password'} placeholder={placeholder} autoComplete={name === 'password' ? 'current-password' : 'new-password'} required />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
      </div>
    </div>
  );
}

function SignIn({ configured, onCreate }: { configured: boolean; onCreate: () => void }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form className="login-form" action={action}>
      <h1>Welcome back, Kene</h1>
      <p className="sub">Sign in to your private operating system.</p>
      <div className="lf">
        <label htmlFor="email">Email address <i>*</i></label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={state.email} required />
      </div>
      <PwField name="password" label="Password" placeholder="••••••••••••" />
      {state.error && <p className="lerr" role="alert">{state.error}</p>}
      <button className="lbtn" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      {!configured && (
        <p className="lalt">This OS has no account yet. <button type="button" onClick={onCreate}>Create account</button></p>
      )}
      <p className="lfoot">Private system. Access is limited to the owner.</p>
    </form>
  );
}

function Create({ configured, onBack }: { configured: boolean; onBack: () => void }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(createAccount, {});
  if (state.setup) {
    const s = state.setup;
    return (
      <div className="login-form">
        <h1>One last step</h1>
        <p className="sub">Nothing is saved on this page. Add these four values in Vercel (Project → Settings → Environment Variables), then redeploy. After that, sign in here.</p>
        <div className="setup-box">
          OWNER_NAME<code>{s.name}</code>
          OWNER_EMAIL<code>{s.email}</code>
          OWNER_PASSWORD_HASH<code>{s.hash}</code>
          AUTH_SECRET<code>{s.secret}</code>
          Your password is not shown and cannot be recovered from the hash. Account creation closes as soon as OWNER_PASSWORD_HASH exists.
        </div>
      </div>
    );
  }
  return (
    <form className="login-form" action={action}>
      <h1>Create your account</h1>
      <p className="sub">One owner, one account. Once it exists, sign-up closes and only sign-in remains.</p>
      <div className="lf"><label htmlFor="name">Full name <i>*</i></label><input id="name" name="name" placeholder="Your full name" autoComplete="name" defaultValue={state.name} required /></div>
      <div className="lf"><label htmlFor="cemail">Email address <i>*</i></label><input id="cemail" name="email" type="email" placeholder="you@example.com" autoComplete="email" defaultValue={state.email} required /></div>
      <div className="lf-two"><PwField name="password" label="Password" /><PwField name="confirm" label="Confirm password" /></div>
      <p className="hint">Password must be at least 8 characters, including a number and a special character.</p>
      {state.error && <p className="lerr" role="alert">{state.error}</p>}
      <button className="lbtn" disabled={pending}>{pending ? 'Creating…' : 'Create account'}</button>
      {configured && <p className="lalt">Already set up? <button type="button" onClick={onBack}>Sign in</button></p>}
      <p className="lfoot">Private system. Access is limited to the owner.</p>
    </form>
  );
}

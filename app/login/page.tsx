import { LoginForm } from './LoginForm';
import { Photo } from '@/components/Art';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const configured = Boolean(process.env.OWNER_PASSWORD_HASH && process.env.AUTH_SECRET && process.env.OWNER_EMAIL);
  return (
    <main className="login-bg">
      <style>{loginCss}</style>
      <div className="login-frame">
        <Photo src="/images/login.jpg" variant="cantilever" className="login-photo">
          <div className="login-cap">
            <p>Everything you run, in one place.</p>
            <p>One quiet screen for the day ahead.</p>
            <small>Kene OS · Private</small>
          </div>
        </Photo>
        <LoginForm configured={configured} />
      </div>
    </main>
  );
}

const loginCss = `
.login-bg{min-height:100dvh;display:grid;place-items:center;background:#949a8e;padding:24px}
.login-frame{width:min(1180px,100%);min-height:min(690px,calc(100dvh - 48px));display:grid;grid-template-columns:1fr 1fr;background:#000;border-radius:24px;padding:10px;gap:0}
.login-photo{border-radius:18px;min-height:420px}
.login-cap{position:absolute;inset:auto 0 0 0;padding:90px 24px 28px;text-align:center;background:linear-gradient(180deg,transparent,rgba(0,0,0,.55) 40%,rgba(30,50,20,.0));}
.login-cap p{margin:0;font-size:18px;line-height:1.5;color:#fff;font-weight:300}
.login-cap small{display:block;margin-top:10px;font-size:12px;color:rgba(255,255,255,.55)}
.login-form{display:flex;flex-direction:column;justify-content:center;padding:40px clamp(24px,7vw,96px)}
.login-form h1{font-size:19px;font-weight:400;margin:0 0 10px}
.login-form .sub{color:#77776f;font-size:12px;line-height:1.6;margin:0 0 34px;max-width:36ch}
.login-form label{font-size:12px;color:#d9d7d0;display:block;margin:0 0 8px}
.login-form label i{color:#a8b58a;font-style:normal}
.lf{margin-bottom:18px}
.lf input{width:100%;height:46px;border-radius:9px;border:1px solid transparent;background:#111113;padding:0 16px;color:#f3f1ea;font-size:13px}
.lf input::placeholder{color:#55554f}
.lf input:focus{outline:none;border-color:#9ba17a;box-shadow:0 0 0 1px rgba(168,181,138,.35)}
.lf-pw{position:relative}.lf-pw button{position:absolute;right:10px;top:0;height:46px;background:none;border:0;color:#6c6c66;font-size:11px}
.lf-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.login-form .hint{font-size:10.5px;color:#5c5c56;margin:-4px 0 26px}
.lbtn{width:100%;height:46px;border:0;border-radius:9px;background:#a8b58a;color:#12140e;font-size:13px;font-weight:500;cursor:pointer}
.lbtn:hover{background:#b6c398}.lbtn:disabled{opacity:.6;cursor:wait}
.lerr{color:#d9857a;font-size:12px;margin:0 0 14px}
.lalt{margin-top:26px;text-align:center;font-size:11.5px;color:#6d6d67}
.lalt button{background:none;border:0;color:#d9d7d0;font-size:11.5px;padding:0;text-decoration:underline;cursor:pointer}
.lfoot{margin-top:46px;text-align:center;font-size:10.5px;color:#55554f}
.setup-box{background:#0f0f11;border:1px solid #232326;border-radius:12px;padding:14px;margin:6px 0 14px;font-size:11.5px;color:#a9a8a1}
.setup-box code{display:block;word-break:break-all;background:#000;border-radius:8px;padding:8px 10px;margin:4px 0 10px;color:#d8e0c3;font-size:11px;user-select:all}
@media(max-width:860px){.login-frame{grid-template-columns:1fr}.login-photo{min-height:220px}.login-form{padding:32px 22px 28px}}
`;

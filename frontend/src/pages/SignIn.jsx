// pages/SignIn.jsx — Login page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function SignIn({ addToast }) {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('');
    if (!form.email || !form.password) { setErr('Please fill all fields'); return; }
    try {
      setLoading(true);
      const res = await api.post('/auth/login', form);
      login(res.data);
      addToast(`Welcome back, ${res.data.name.split(' ')[0]}! 👋`, 'success');
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .auth-wrap{min-height:calc(100vh - 68px);display:flex;align-items:center;justify-content:center;padding:40px 24px;position:relative;z-index:2;}
        .auth-card{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r-lg);padding:40px;width:100%;max-width:440px;box-shadow:var(--shadow-lg),var(--glow);animation:fadeUp .5s ease both;}
        .auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:28px;font-weight:800;font-size:1.25rem;letter-spacing:-0.03em;color:var(--text);}
        .auth-lm{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),#f471b5);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(124,111,247,0.4);}
        .auth-h{font-size:1.6rem;font-weight:800;letter-spacing:-0.03em;margin-bottom:6px;}
        .auth-sub{font-size:0.875rem;color:var(--text3);margin-bottom:28px;}
        .auth-sub a{color:var(--accent2);font-weight:600;cursor:pointer;text-decoration:none;}
        .auth-sub a:hover{text-decoration:underline;}
        .f-label{display:block;font-size:0.8rem;font-weight:700;color:var(--text2);margin-bottom:7px;letter-spacing:0.02em;text-transform:uppercase;}
        .f-input{width:100%;padding:13px 16px;border-radius:12px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-size:0.9rem;outline:none;font-family:inherit;transition:border-color .2s,box-shadow .2s;margin-bottom:16px;}
        .f-input:focus{border-color:rgba(124,111,247,0.4);box-shadow:0 0 0 3px rgba(124,111,247,0.08);}
        .f-input::placeholder{color:var(--text3);}
        .auth-btn{width:100%;padding:14px;border-radius:14px;border:none;background:linear-gradient(135deg,var(--accent) 0%,var(--accent3) 100%);color:#fff;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all .25s;font-family:inherit;box-shadow:0 6px 24px rgba(124,111,247,0.35);letter-spacing:0.02em;}
        .auth-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 32px rgba(124,111,247,0.45);}
        .auth-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .err-box{padding:12px 14px;border-radius:10px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);color:#f87171;font-size:0.85rem;margin-bottom:16px;}
        .divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--text3);font-size:0.8rem;}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
        .guest-btn{width:100%;padding:12px;border-radius:14px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);font-weight:600;font-size:0.875rem;cursor:pointer;font-family:inherit;transition:all .2s;}
        .guest-btn:hover{border-color:rgba(124,111,247,0.3);color:var(--accent2);}
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-lm">💼</div>
            Hirely
          </div>
          <h1 className="auth-h">Welcome back</h1>
          <p className="auth-sub">
            Don't have an account?{' '}
            <a onClick={() => navigate('/get-started')}>Get started free →</a>
          </p>

          {err && <div className="err-box">⚠ {err}</div>}

          <form onSubmit={handleSubmit}>
            <label className="f-label">Email Address</label>
            <input className="f-input" type="email" placeholder="shaurya@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

            <label className="f-label">Password</label>
            <input className="f-input" type="password" placeholder="Your password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

            <div style={{ height:8 }} />
            <button className="auth-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="divider">or</div>
          <button className="guest-btn" onClick={() => navigate('/')}>
            Continue as Guest
          </button>
        </div>
      </div>
    </>
  );
}

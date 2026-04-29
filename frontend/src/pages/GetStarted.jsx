// pages/GetStarted.jsx — Registration / onboarding page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function GetStarted({ addToast }) {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('');
    if (!form.name || !form.email || !form.password) { setErr('All fields are required'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      const res = await api.post('/auth/register', form);
      login(res.data);
      addToast(`Welcome to Hirely, ${res.data.name.split(' ')[0]}! 🎉`, 'success');
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .gs-wrap{min-height:calc(100vh - 68px);display:flex;align-items:center;justify-content:center;padding:40px 24px;position:relative;z-index:2;}
        .gs-card{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r-lg);padding:40px;width:100%;max-width:480px;box-shadow:var(--shadow-lg),var(--glow);animation:fadeUp .5s ease both;}
        .gs-top{text-align:center;margin-bottom:32px;}
        .gs-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:99px;background:rgba(124,111,247,0.08);border:1px solid rgba(124,111,247,0.2);color:var(--accent2);font-size:0.78rem;font-weight:700;letter-spacing:0.05em;margin-bottom:18px;}
        .gs-h{font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;margin-bottom:8px;background:linear-gradient(135deg,var(--text) 0%,var(--accent2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .gs-sub{font-size:0.875rem;color:var(--text3);}
        .gs-sub a{color:var(--accent2);font-weight:600;cursor:pointer;}
        .gs-sub a:hover{text-decoration:underline;}
        .f-row{display:grid;grid-template-columns:1fr;gap:0;}
        .f-label{display:block;font-size:0.78rem;font-weight:700;color:var(--text2);margin-bottom:7px;letter-spacing:0.03em;text-transform:uppercase;}
        .f-input{width:100%;padding:13px 16px;border-radius:12px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-size:0.9rem;outline:none;font-family:inherit;transition:border-color .2s,box-shadow .2s;margin-bottom:16px;}
        .f-input:focus{border-color:rgba(124,111,247,0.4);box-shadow:0 0 0 3px rgba(124,111,247,0.08);}
        .f-input::placeholder{color:var(--text3);}
        .gs-btn{width:100%;padding:14px;border-radius:14px;border:none;background:linear-gradient(135deg,var(--accent) 0%,var(--accent3) 100%);color:#fff;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all .25s;font-family:inherit;box-shadow:0 6px 24px rgba(124,111,247,0.35);letter-spacing:0.02em;}
        .gs-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 32px rgba(124,111,247,0.45);}
        .gs-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .err-box{padding:12px 14px;border-radius:10px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);color:#f87171;font-size:0.85rem;margin-bottom:16px;}
        .perks{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px;}
        .perk{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;background:var(--bg3);border:1px solid var(--border);font-size:0.8rem;color:var(--text2);}
        .terms{text-align:center;font-size:0.75rem;color:var(--text3);margin-top:16px;}
      `}</style>

      <div className="gs-wrap">
        <div className="gs-card">
          <div className="gs-top">
            <div className="gs-badge">✦ Join 50,000+ job seekers</div>
            <h1 className="gs-h">Start your journey,<br/>Shaurya Singh</h1>
            <p className="gs-sub">
              Already have an account?{' '}
              <a onClick={() => navigate('/signin')}>Sign in →</a>
            </p>
          </div>

          {/* Perks */}
          <div className="perks">
            {['🔖 Save jobs','📨 1-click apply','📊 Track status','🔔 Job alerts'].map(p => (
              <div key={p} className="perk">{p}</div>
            ))}
          </div>

          {err && <div className="err-box">⚠ {err}</div>}

          <form onSubmit={handleSubmit}>
            <label className="f-label">Full Name</label>
            <input className="f-input" type="text" placeholder="Shaurya Singh"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />

            <label className="f-label">Email Address</label>
            <input className="f-input" type="email" placeholder="shaurya@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

            <label className="f-label">Password</label>
            <input className="f-input" type="password" placeholder="Minimum 6 characters"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

            <div style={{ height:6 }} />
            <button className="gs-btn" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Free Account →'}
            </button>
          </form>

          <p className="terms">By signing up, you agree to Hirely's Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </>
  );
}

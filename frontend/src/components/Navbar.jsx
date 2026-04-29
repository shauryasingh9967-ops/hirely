// components/Navbar.jsx — Sticky top nav with auth + theme
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ savedCount = 0, appliedCount = 0 }) {
  const { user, logout }       = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [drop, setDrop] = useState(false);

  const badgeCount = savedCount + appliedCount;
  const isDark = theme === 'dark';
  const path   = location.pathname;

  return (
    <>
      <style>{`
        .navbar{
          position:sticky;top:0;z-index:500;height:68px;padding:0 28px;
          display:flex;align-items:center;justify-content:space-between;gap:16px;
          background:${isDark?'rgba(10,10,15,0.78)':'rgba(244,243,249,0.82)'};
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border-bottom:1px solid var(--border);transition:background .4s;
        }
        .n-logo{
          display:flex;align-items:center;gap:11px;cursor:pointer;
          font-weight:800;font-size:1.3rem;letter-spacing:-0.03em;color:var(--text);
        }
        .n-logo:hover .logo-mark{transform:rotate(-10deg) scale(1.12);}
        .logo-mark{
          width:40px;height:40px;border-radius:12px;
          background:linear-gradient(135deg,var(--accent) 0%,#f471b5 100%);
          display:flex;align-items:center;justify-content:center;font-size:1.1rem;
          box-shadow:0 4px 20px rgba(124,111,247,0.4);
          transition:transform .35s cubic-bezier(0.34,1.56,0.64,1);
          position:relative;overflow:hidden;
        }
        .logo-mark::after{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:rgba(255,255,255,0.18);}
        .n-pills{display:flex;gap:4px;}
        .n-pill{
          padding:8px 17px;border-radius:99px;border:none;
          background:transparent;color:var(--text2);
          font-size:0.875rem;font-weight:500;cursor:pointer;
          transition:all .2s;position:relative;font-family:inherit;
        }
        .n-pill:hover{color:var(--text);background:rgba(255,255,255,0.05);}
        .n-pill.on{
          background:rgba(124,111,247,0.1);color:var(--accent2);font-weight:700;
          border:1px solid rgba(124,111,247,0.2);
        }
        [data-theme="light"] .n-pill:hover{background:rgba(0,0,0,0.05);}
        [data-theme="light"] .n-pill.on{background:rgba(99,85,216,0.08);border-color:rgba(99,85,216,0.18);}
        .n-badge{
          position:absolute;top:-3px;right:-3px;
          width:17px;height:17px;border-radius:99px;
          background:var(--accent);color:#fff;font-size:0.62rem;font-weight:800;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px rgba(124,111,247,0.5);
          animation:badgePop .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .n-right{display:flex;align-items:center;gap:8px;}
        .theme-btn{
          width:40px;height:40px;border-radius:12px;
          border:1px solid var(--border2);background:var(--bg3);
          color:var(--text2);display:flex;align-items:center;justify-content:center;
          font-size:1rem;cursor:pointer;transition:all .2s;
        }
        .theme-btn:hover{border-color:var(--accent);color:var(--accent);transform:scale(1.06);}
        .user-btn{
          display:flex;align-items:center;gap:9px;padding:6px 14px 6px 6px;
          border-radius:99px;border:1px solid var(--border2);background:var(--bg3);
          cursor:pointer;transition:all .2s;position:relative;
        }
        .user-btn:hover{border-color:rgba(124,111,247,0.3);}
        .u-avatar{
          width:30px;height:30px;border-radius:99px;
          background:linear-gradient(135deg,var(--accent),#f471b5);
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-weight:800;font-size:0.8rem;
        }
        .u-name{font-size:0.82rem;font-weight:600;color:var(--text);}
        .u-drop{
          position:absolute;top:calc(100% + 10px);right:0;
          background:var(--bg2);border:1px solid var(--border2);
          border-radius:var(--r);padding:8px;min-width:190px;
          box-shadow:var(--shadow-lg);animation:fadeDown .25s ease;z-index:600;
        }
        .d-item{
          width:100%;padding:10px 14px;border-radius:10px;border:none;
          background:transparent;color:var(--text2);font-size:0.875rem;font-weight:500;
          cursor:pointer;transition:all .15s;text-align:left;font-family:inherit;
          display:flex;align-items:center;gap:9px;
        }
        .d-item:hover{background:rgba(124,111,247,0.08);color:var(--text);}
        .d-item.red:hover{background:rgba(248,113,113,0.08);color:#f87171;}
        .d-hr{height:1px;background:var(--border);margin:6px 0;}
        .btn-si{
          padding:9px 18px;border-radius:12px;
          border:1px solid var(--border2);background:var(--bg3);
          color:var(--text2);font-size:0.85rem;font-weight:600;
          cursor:pointer;transition:all .2s;font-family:inherit;
        }
        .btn-si:hover{border-color:rgba(124,111,247,0.3);color:var(--accent2);}
        .btn-gs{
          padding:9px 20px;border-radius:12px;border:none;
          background:linear-gradient(135deg,var(--accent) 0%,var(--accent3) 100%);
          color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;
          transition:all .25s;font-family:inherit;letter-spacing:0.01em;
          box-shadow:0 4px 18px rgba(124,111,247,0.35);
        }
        .btn-gs:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(124,111,247,0.45);}
        .btn-gs:active{transform:translateY(0);}
        @media(max-width:560px){.btn-gs{display:none;}.navbar{padding:0 16px;}}
      `}</style>

      <nav className="navbar">
        <div className="n-logo" onClick={() => navigate('/')}>
          <div className="logo-mark">💼</div>
          Hirely
        </div>

        <div className="n-pills">
          {[['/', 'Browse Jobs'], ['/profile', 'My Profile']].map(([p, label]) => (
            <button key={p} className={`n-pill ${path === p ? 'on' : ''}`}
              onClick={() => navigate(p)} style={{ position: 'relative' }}>
              {label}
              {p === '/profile' && badgeCount > 0 && (
                <span className="n-badge">{badgeCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="n-right">
          <button className="theme-btn" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button className="user-btn" onClick={() => setDrop(d => !d)}>
                <div className="u-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="u-name">{user.name.split(' ')[0]}</span>
                <span style={{ color: 'var(--text3)', fontSize: '0.7rem' }}>▾</span>
              </button>
              {drop && (
                <div className="u-drop" onMouseLeave={() => setDrop(false)}>
                  <div style={{ padding:'10px 14px 8px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text)' }}>{user.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:2 }}>{user.email}</div>
                  </div>
                  <div style={{ height:6 }} />
                  <button className="d-item" onClick={() => { navigate('/profile'); setDrop(false); }}>👤 My Profile</button>
                  <div className="d-hr" />
                  <button className="d-item red" onClick={() => { logout(); setDrop(false); navigate('/'); }}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-si" onClick={() => navigate('/signin')}>Sign In</button>
              <button className="btn-gs" onClick={() => navigate('/get-started')}>Get Started ✦</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

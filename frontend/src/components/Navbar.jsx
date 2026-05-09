// components/Navbar.jsx — Premium responsive navbar (FIXED MOBILE MENU)
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ savedCount = 0, appliedCount = 0 }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const [drop, setDrop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const badgeCount = savedCount + appliedCount;
  const isDark = theme === 'dark';
  const path = location.pathname;

  return (
    <>
      <style>{`
        .navbar{
          position:sticky;
          top:0;
          z-index:500;
          height:68px;
          padding:0 28px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          background:${isDark ? 'rgba(10,10,15,0.78)' : 'rgba(244,243,249,0.82)'};
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border-bottom:1px solid var(--border);
          width:100%;
          max-width:100%;
        }

        .n-logo{
          display:flex;
          align-items:center;
          gap:11px;
          cursor:pointer;
          font-weight:800;
          font-size:1.3rem;
          letter-spacing:-0.03em;
          color:var(--text);
          flex-shrink:0;
        }

        .logo-mark{
          width:40px;
          height:40px;
          border-radius:12px;
          background:linear-gradient(135deg,var(--accent) 0%,#f471b5 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.1rem;
          box-shadow:0 4px 20px rgba(124,111,247,0.4);
        }

        .n-pills{
          flex:1;
          display:flex;
          justify-content:center;
          gap:6px;
        }

        .n-pill{
          padding:8px 16px;
          border:none;
          border-radius:99px;
          background:transparent;
          color:var(--text2);
          font-size:.88rem;
          font-weight:600;
          cursor:pointer;
          transition:.2s;
          position:relative;
        }

        .n-pill:hover{
          background:rgba(124,111,247,0.08);
          color:var(--text);
        }

        .n-pill.on{
          background:rgba(124,111,247,0.12);
          color:var(--accent2);
        }

        .n-badge{
          position:absolute;
          top:-4px;
          right:-4px;
          min-width:18px;
          height:18px;
          border-radius:99px;
          background:var(--accent);
          color:#fff;
          font-size:.65rem;
          font-weight:800;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0 5px;
        }

        .n-right{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .theme-btn{
          width:40px;
          height:40px;
          border-radius:12px;
          border:1px solid var(--border2);
          background:var(--bg3);
          color:var(--text2);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1rem;
          cursor:pointer;
          transition:.2s;
        }

        .theme-btn:hover{
          border-color:var(--accent);
          color:var(--accent);
        }

        .btn-si{
          padding:9px 18px;
          border-radius:12px;
          border:1px solid var(--border2);
          background:var(--bg3);
          color:var(--text2);
          font-size:.85rem;
          font-weight:600;
          cursor:pointer;
        }

        .btn-gs{
          padding:9px 20px;
          border:none;
          border-radius:12px;
          background:linear-gradient(135deg,var(--accent),var(--accent3));
          color:#fff;
          font-size:.85rem;
          font-weight:700;
          cursor:pointer;
          box-shadow:0 4px 18px rgba(124,111,247,0.35);
        }

        .user-btn{
          display:flex;
          align-items:center;
          gap:8px;
          padding:5px 12px 5px 5px;
          border-radius:999px;
          border:1px solid var(--border2);
          background:var(--bg3);
          cursor:pointer;
          position:relative;
        }

        .u-avatar{
          width:30px;
          height:30px;
          border-radius:999px;
          background:linear-gradient(135deg,var(--accent),#f471b5);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          font-size:.82rem;
          font-weight:800;
        }

        .u-name{
          font-size:.82rem;
          font-weight:600;
          color:var(--text);
        }

        .u-drop{
          position:absolute;
          top:calc(100% + 10px);
          right:0;
          min-width:220px;
          background:rgba(15,15,22,.92);
          border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(24px);
          border-radius:18px;
          padding:8px;
          box-shadow:0 20px 50px rgba(0,0,0,.4);
          z-index:999;
          animation:fadeMenu .22s ease;
        }

        [data-theme="light"] .u-drop{
          background:rgba(255,255,255,.92);
        }

        .d-item{
          width:100%;
          padding:11px 14px;
          border:none;
          border-radius:12px;
          background:transparent;
          color:var(--text2);
          text-align:left;
          cursor:pointer;
          font-size:.88rem;
          font-weight:600;
          transition:.2s;
        }

        .d-item:hover{
          background:rgba(124,111,247,.1);
          color:var(--text);
        }

        .d-item.red:hover{
          background:rgba(248,113,113,.08);
          color:#f87171;
        }

        .d-hr{
          height:1px;
          background:var(--border);
          margin:6px 0;
        }

        .mobile-actions{
          display:none;
          align-items:center;
          gap:10px;
        }

        .hamburger{
          display:none;
          flex-direction:column;
          gap:4px;
          background:none;
          border:none;
          cursor:pointer;
          padding:8px;
        }

        .hamburger span{
          width:20px;
          height:2px;
          background:var(--text);
          border-radius:99px;
          transition:.3s;
        }

        .hamburger.open span:nth-child(1){
          transform:rotate(45deg) translate(5px,5px);
        }

        .hamburger.open span:nth-child(2){
          opacity:0;
        }

        .hamburger.open span:nth-child(3){
          transform:rotate(-45deg) translate(6px,-5px);
        }

        .m-menu{
          position:absolute;
          top:76px;
          right:16px;
          width:220px;
          background:rgba(15,15,22,.95);
          border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(24px);
          border-radius:20px;
          padding:10px;
          display:flex;
          flex-direction:column;
          gap:6px;
          z-index:999;
          box-shadow:0 20px 50px rgba(0,0,0,.45);
          animation:fadeMenu .22s ease;
        }

        [data-theme="light"] .m-menu{
          background:rgba(255,255,255,.95);
        }

        .m-pill{
          width:100%;
          padding:12px 14px;
          border:none;
          border-radius:14px;
          background:transparent;
          color:var(--text2);
          text-align:left;
          font-size:.88rem;
          font-weight:600;
          cursor:pointer;
          transition:.2s;
        }

        .m-pill:hover{
          background:rgba(124,111,247,.12);
          color:var(--text);
        }

        .m-pill.on{
          background:rgba(124,111,247,.14);
          color:var(--accent2);
        }

        @keyframes fadeMenu{
          from{
            opacity:0;
            transform:translateY(-8px) scale(.98);
          }
          to{
            opacity:1;
            transform:translateY(0) scale(1);
          }
        }

        @media(max-width:768px){

          .navbar{
            padding:0 16px;
          }

          .n-pills{
            display:none;
          }

          .n-right{
            display:none;
          }

          .mobile-actions{
            display:flex;
          }

          .hamburger{
            display:flex;
          }

          .u-name{
            display:none;
          }
        }
      `}</style>

      <nav className="navbar">

        <div className="n-logo" onClick={() => navigate('/')}>
          <div className="logo-mark">💼</div>
          Hirely
        </div>

        <div className="n-pills">
          {[['/', 'Browse Jobs'], ['/profile', 'My Profile']].map(([p, label]) => (
            <button
              key={p}
              className={`n-pill ${path === p ? 'on' : ''}`}
              onClick={() => navigate(p)}
            >
              {label}

              {p === '/profile' && badgeCount > 0 && (
                <span className="n-badge">{badgeCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* MOBILE ACTIONS */}
        <div className="mobile-actions">

          <button className="theme-btn" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {user && (
            <button className="user-btn" onClick={() => setDrop(d => !d)}>
              <div className="u-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </button>
          )}

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* DESKTOP RIGHT */}
        <div className="n-right">

          <button className="theme-btn" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div style={{ position:'relative' }}>

              <button className="user-btn" onClick={() => setDrop(d => !d)}>
                <div className="u-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="u-name">
                  {user.name.split(' ')[0]}
                </span>

                <span style={{ fontSize:'.7rem', color:'var(--text3)' }}>
                  ▾
                </span>
              </button>

              {drop && (
                <div className="u-drop">

                  <div style={{
                    padding:'10px 14px 8px',
                    borderBottom:'1px solid var(--border)'
                  }}>
                    <div style={{
                      fontSize:'.88rem',
                      fontWeight:700,
                      color:'var(--text)'
                    }}>
                      {user.name}
                    </div>

                    <div style={{
                      fontSize:'.75rem',
                      color:'var(--text3)',
                      marginTop:2
                    }}>
                      {user.email}
                    </div>
                  </div>

                  <div style={{ height:6 }} />

                  <button
                    className="d-item"
                    onClick={() => {
                      navigate('/profile');
                      setDrop(false);
                    }}
                  >
                    👤 My Profile
                  </button>

                  <div className="d-hr" />

                  <button
                    className="d-item red"
                    onClick={() => {
                      logout();
                      navigate('/');
                      setDrop(false);
                    }}
                  >
                    🚪 Sign Out
                  </button>

                </div>
              )}

            </div>
          ) : (
            <>
              <button
                className="btn-si"
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>

              <button
                className="btn-gs"
                onClick={() => navigate('/get-started')}
              >
                Get Started ✦
              </button>
            </>
          )}

        </div>
        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="m-menu">

            <button
              className={`m-pill ${path === '/' ? 'on' : ''}`}
              onClick={() => {
                navigate('/');
                setMenuOpen(false);
              }}
            >
              💼 Browse Jobs
            </button>

            <button
              className={`m-pill ${path === '/profile' ? 'on' : ''}`}
              onClick={() => {
                navigate('/profile');
                setMenuOpen(false);
              }}
            >
              👤 My Profile
            </button>

          </div>
        )}

      </nav>
    </>
  );
}
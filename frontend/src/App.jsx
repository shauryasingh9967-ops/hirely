// App.jsx — Root with routing + global state
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useToast }      from './hooks/useToast';
import { useAuth }       from './context/AuthContext';
import Navbar            from './components/Navbar';
import BackgroundEffects from './components/BackgroundEffects';
import ToastContainer    from './components/Toast';
import Home       from './pages/Home';
import Profile    from './pages/Profile';
import SignIn     from './pages/SignIn';
import GetStarted from './pages/GetStarted';
import api        from './utils/api';
import './index.css';

function AppInner() {
  const { user }             = useAuth();
  const { toasts, addToast } = useToast();
  const [savedJobs,   setSavedJobs]   = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showTop,     setShowTop]     = useState(false);

  useEffect(() => {
    if (!user) { setSavedJobs(new Set()); setAppliedJobs(new Set()); return; }
    (async () => {
      try {
        const [sv, ap] = await Promise.all([api.get('/saved'), api.get('/applications')]);
        setSavedJobs(new Set(sv.data.map(s => s.job?._id).filter(Boolean)));
        setAppliedJobs(new Set(ap.data.map(a => a.job?._id).filter(Boolean)));
      } catch {}
    })();
  }, [user]);

  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const sp = { savedJobs, setSavedJobs, appliedJobs, setAppliedJobs, addToast };

  return (
    <div>
      <BackgroundEffects />
      <ToastContainer toasts={toasts} />

      {showTop && (
        <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} style={{
          position:'fixed',bottom:30,right:30,zIndex:400,
          width:44,height:44,borderRadius:14,border:'none',
          background:'var(--accent)',color:'#fff',fontSize:'1.1rem',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 6px 24px rgba(124,111,247,0.4)',cursor:'pointer',
          fontFamily:'inherit',
        }}>↑</button>
      )}

      <div style={{ position:'relative', zIndex:2 }}>
        <Navbar savedCount={savedJobs.size} appliedCount={appliedJobs.size} />
        <Routes>
          <Route path="/"            element={<Home       {...sp} />} />
          <Route path="/profile"     element={<Profile    {...sp} />} />
          <Route path="/signin"      element={<SignIn     addToast={addToast} />} />
          <Route path="/get-started" element={<GetStarted addToast={addToast} />} />
          <Route path="*" element={
            <div style={{textAlign:'center',padding:'100px 24px',position:'relative',zIndex:2}}>
              <div style={{fontSize:'5rem',marginBottom:20}}>404</div>
              <h2 style={{fontSize:'1.5rem',fontWeight:700,marginBottom:8}}>Page not found</h2>
              <p style={{color:'var(--text3)',marginBottom:24}}>Looks like you're lost in the cosmos 🌌</p>
              <a href="/" style={{padding:'12px 24px',borderRadius:12,background:'var(--accent)',color:'#fff',fontWeight:700,fontSize:'0.9rem',textDecoration:'none'}}>Back to Home →</a>
            </div>
          }/>
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

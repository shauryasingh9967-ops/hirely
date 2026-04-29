// pages/Profile.jsx — User dashboard with saved + applied jobs
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobModal  from '../components/JobModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Profile({ savedJobs, setSavedJobs, appliedJobs, setAppliedJobs, addToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedList,   setSavedList]   = useState([]);
  const [appliedList, setAppliedList] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sv, ap] = await Promise.all([api.get('/saved'), api.get('/applications')]);
      setSavedList(sv.data.map(s => s.job).filter(Boolean));
      setAppliedList(ap.data.map(a => a.job).filter(Boolean));
      setSavedJobs(new Set(sv.data.map(s => s.job?._id).filter(Boolean)));
      setAppliedJobs(new Set(ap.data.map(a => a.job?._id).filter(Boolean)));
    } catch { addToast('Failed to load profile data', 'error'); }
    finally { setLoading(false); }
  };

  const handleSave = async (job) => {
    try {
      const res = await api.post('/save', { jobId: job._id });
      if (res.data.saved) {
        setSavedJobs(prev => new Set([...prev, job._id]));
      } else {
        setSavedJobs(prev => { const n = new Set(prev); n.delete(job._id); return n; });
        setSavedList(prev => prev.filter(j => j._id !== job._id));
      }
      addToast(res.data.saved ? 'Saved! 🔖' : 'Removed from saved', res.data.saved ? 'success' : 'info');
    } catch { addToast('Error', 'error'); }
  };

  const handleApply = async (job) => {
    if (appliedJobs.has(job._id)) return;
    try {
      await api.post('/apply', { jobId: job._id });
      setAppliedJobs(prev => new Set([...prev, job._id]));
      addToast(`Applied to ${job.title}! 🎉`, 'success');
    } catch (e) { addToast(e.response?.data?.message || 'Apply failed', 'error'); }
  };

  if (!user) return null;

  const initial = user.name?.charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .pw{max-width:700px;margin:0 auto;padding:40px 24px 80px;position:relative;z-index:2;}
        .p-hero{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r-lg);padding:28px;margin-bottom:20px;display:flex;align-items:center;gap:22px;position:relative;overflow:hidden;animation:fadeUp .5s ease both;}
        .p-hero::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,111,247,0.05) 0%,rgba(244,113,181,0.03) 100%);pointer-events:none;}
        .p-av{width:72px;height:72px;border-radius:22px;flex-shrink:0;background:linear-gradient(135deg,var(--accent) 0%,#f471b5 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.7rem;box-shadow:0 8px 24px rgba(124,111,247,0.3);position:relative;overflow:hidden;}
        .p-av::after{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:rgba(255,255,255,0.15);}
        .p-name{font-size:1.2rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;}
        .p-sub{font-size:0.82rem;color:var(--text3);margin-bottom:8px;}
        .p-status{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:99px;background:rgba(34,212,143,0.08);border:1px solid rgba(34,212,143,0.2);font-size:0.74rem;font-weight:700;color:var(--green);}
        .p-sdot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulseGlow 2s infinite;}
        .p-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
        .psc{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:20px;text-align:center;transition:all .25s;animation:fadeUp .5s ease both;}
        .psc:hover{border-color:rgba(124,111,247,0.25);transform:translateY(-3px);box-shadow:var(--glow);}
        .psn{font-weight:800;font-size:1.75rem;letter-spacing:-0.03em;margin-bottom:4px;}
        .psl{font-size:0.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;}
        .p-sec{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:22px;margin-bottom:16px;animation:fadeUp .5s ease both;}
        .p-sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
        .p-st{display:flex;align-items:center;gap:9px;font-size:0.95rem;font-weight:700;color:var(--text);}
        .p-sc{padding:4px 12px;border-radius:99px;font-size:0.72rem;font-weight:800;}
        .mc{display:flex;align-items:center;gap:13px;padding:12px;border-radius:12px;cursor:pointer;transition:all .2s;}
        .mc:hover{background:rgba(124,111,247,0.06);}
        .mc-logo{width:40px;height:40px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.9rem;box-shadow:0 4px 12px rgba(0,0,0,0.2);}
        .mc-t{font-size:0.875rem;font-weight:700;color:var(--text);margin-bottom:2px;}
        .mc-s{font-size:0.75rem;color:var(--text3);}
        .mc-arrow{margin-left:auto;color:var(--text3);flex-shrink:0;transition:all .2s;}
        .mc:hover .mc-arrow{color:var(--accent);transform:translateX(3px);}
        .ac{margin-left:auto;flex-shrink:0;padding:4px 11px;border-radius:99px;background:var(--green-bg);color:var(--green);font-size:0.72rem;font-weight:800;}
        .p-empty{text-align:center;padding:28px 0;color:var(--text3);font-size:0.875rem;}
        @media(max-width:600px){.pw{padding:24px 16px 60px;}.p-stats{gap:10px;}}
      `}</style>

      <div className="pw">
        {/* Profile Card */}
        <div className="p-hero">
          <div className="p-av">
            <span style={{ position:'relative', zIndex:1 }}>{initial}</span>
          </div>
          <div>
            <div className="p-name">{user.name}</div>
            <div className="p-sub">{user.email}</div>
            <div className="p-status"><span className="p-sdot"/>Actively Looking</div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-stats">
          {[
            { n: savedList.length,   l:'Saved Jobs', c:'var(--accent2)' },
            { n: appliedList.length, l:'Applied',    c:'var(--green)'   },
            { n: savedList.length + appliedList.length, l:'Total Activity', c:'var(--blue)' },
          ].map((s,i) => (
            <div key={i} className="psc" style={{ animationDelay:`${i*0.1}s` }}>
              <div className="psn" style={{ color:s.c }}>{s.n}</div>
              <div className="psl">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Saved Jobs */}
        <div className="p-sec">
          <div className="p-sh">
            <div className="p-st">
              <svg width="16" height="16" fill="none" stroke="var(--accent)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              Saved Jobs
            </div>
            <span className="p-sc" style={{ background:'rgba(124,111,247,0.1)', color:'var(--accent2)' }}>{savedList.length}</span>
          </div>
          {loading ? <div className="p-empty">Loading…</div>
            : savedList.length === 0
              ? <div className="p-empty">No saved jobs yet — bookmark something you like! 🔖</div>
              : savedList.map(job => (
                <div key={job._id} className="mc" onClick={() => setSelected(job)}>
                  <div className="mc-logo" style={{ background:job.color }}>{job.logo}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="mc-t">{job.title}</div>
                    <div className="mc-s">{job.company} · {job.location}</div>
                  </div>
                  <svg className="mc-arrow" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </div>
              ))
          }
        </div>

        {/* Applied Jobs */}
        <div className="p-sec">
          <div className="p-sh">
            <div className="p-st">
              <svg width="16" height="16" fill="none" stroke="var(--accent)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Applications
            </div>
            <span className="p-sc" style={{ background:'var(--green-bg)', color:'var(--green)' }}>{appliedList.length}</span>
          </div>
          {loading ? <div className="p-empty">Loading…</div>
            : appliedList.length === 0
              ? <div className="p-empty">No applications yet — start applying! 🚀</div>
              : appliedList.map(job => (
                <div key={job._id} className="mc" onClick={() => setSelected(job)}>
                  <div className="mc-logo" style={{ background:job.color }}>{job.logo}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="mc-t">{job.title}</div>
                    <div className="mc-s">{job.company}</div>
                  </div>
                  <span className="ac">Applied ✓</span>
                </div>
              ))
          }
        </div>
      </div>

      {selected && (
        <JobModal job={selected}
          isSaved={savedJobs.has(selected._id)} isApplied={appliedJobs.has(selected._id)}
          onSave={handleSave} onApply={handleApply} onClose={() => setSelected(null)}/>
      )}
    </>
  );
}

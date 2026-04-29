// components/JobModal.jsx — Job detail modal with apply + save
import { useState, useEffect } from 'react';

const typeStyle = {
  'Full-time': { bg:'var(--green-bg)', color:'var(--green)' },
  'Part-time': { bg:'var(--blue-bg)',  color:'var(--blue)'  },
  'Contract':  { bg:'var(--amber-bg)', color:'var(--amber)' },
  'Internship':{ bg:'rgba(244,113,181,0.08)', color:'#f471b5' },
};

export default function JobModal({ job, isSaved, isApplied, onSave, onApply, onClose }) {
  const [applying, setApplying] = useState(false);
  const ts = typeStyle[job.type] || typeStyle['Full-time'];

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleApply = async () => {
    if (isApplied || applying) return;
    setApplying(true);
    await onApply(job);
    setApplying(false);
  };

  return (
    <>
      <style>{`
        .m-overlay {
          position:fixed;inset:0;z-index:800;
          background:rgba(0,0,0,0.62);
          backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          display:flex;align-items:flex-end;justify-content:center;
          animation:fadeIn .25s ease;
        }
        @media(min-width:640px){.m-overlay{align-items:center;padding:24px;}}
        .m-box {
          background:var(--bg2);width:100%;max-width:660px;max-height:93vh;
          overflow-y:auto;border-radius:32px 32px 0 0;
          border:1px solid var(--border2);
          animation:modalIn .42s cubic-bezier(0.34,1.2,0.64,1);
        }
        @media(min-width:640px){.m-box{border-radius:32px;}}
        .m-header {
          position:sticky;top:0;z-index:10;
          padding:16px 22px;border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
          background:var(--bg2);border-radius:32px 32px 0 0;
          backdrop-filter:blur(16px);
        }
        @media(min-width:640px){.m-header{border-radius:32px 32px 0 0;}}
        .m-close {
          width:34px;height:34px;border-radius:99px;border:none;
          background:rgba(255,255,255,0.06);color:var(--text2);
          display:flex;align-items:center;justify-content:center;font-size:1.1rem;
          cursor:pointer;transition:all .2s;
        }
        .m-close:hover{background:rgba(124,111,247,0.15);color:var(--accent2);}
        .m-tag {
          padding:7px 15px;border-radius:10px;
          background:rgba(124,111,247,0.08);border:1px solid rgba(124,111,247,0.18);
          color:var(--accent2);font-size:0.8rem;font-weight:700;letter-spacing:0.02em;
        }
        .req-num {
          width:24px;height:24px;border-radius:8px;flex-shrink:0;
          background:rgba(124,111,247,0.1);border:1px solid rgba(124,111,247,0.2);
          color:var(--accent2);font-size:0.7rem;font-weight:800;
          display:flex;align-items:center;justify-content:center;
        }
        .benefit-box {
          display:flex;align-items:center;gap:9px;
          padding:11px 14px;border-radius:12px;
          background:var(--bg3);border:1px solid var(--border);
          font-size:0.82rem;color:var(--text2);
          transition:all .2s;
        }
        .benefit-box:hover{border-color:rgba(124,111,247,0.2);background:rgba(124,111,247,0.05);}
        .apply-btn {
          flex:1;padding:15px;border-radius:14px;border:none;
          background:linear-gradient(135deg,var(--accent) 0%,var(--accent3) 100%);
          color:#fff;font-weight:700;font-size:0.95rem;letter-spacing:0.02em;
          box-shadow:0 6px 24px rgba(124,111,247,0.35);
          transition:all .25s;cursor:pointer;font-family:inherit;
        }
        .apply-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(124,111,247,0.45);}
        .apply-btn:disabled{opacity:0.7;transform:none;cursor:not-allowed;}
        .apply-btn.done {
          background:linear-gradient(135deg,rgba(34,212,143,0.15),rgba(34,212,143,0.08));
          color:var(--green);box-shadow:none;border:1px solid rgba(34,212,143,0.2);cursor:default;
        }
        .save-btn {
          width:54px;border-radius:14px;border:2px solid var(--border2);
          background:var(--bg3);color:var(--text3);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:all .2s;
        }
        .save-btn:hover,.save-btn.on {
          border-color:rgba(124,111,247,0.35);
          color:var(--accent);background:rgba(124,111,247,0.08);
        }
      `}</style>

      <div className="m-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="m-box">
          {/* Header */}
          <div className="m-header">
            <span style={{ fontSize:'0.76rem', color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Job Details
            </span>
            <button className="m-close" onClick={onClose}>✕</button>
          </div>

          {/* Body */}
          <div style={{ padding:28 }}>
            {/* Company row */}
            <div style={{ display:'flex', gap:18, alignItems:'flex-start', marginBottom:22 }}>
              <div style={{
                width:64, height:64, borderRadius:18, flexShrink:0,
                background:job.color, display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontWeight:800, fontSize:'1.5rem',
                boxShadow:'0 8px 24px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden',
              }}>
                <span style={{ position:'relative', zIndex:1 }}>{job.logo}</span>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'rgba(255,255,255,0.12)' }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:'1.4rem', letterSpacing:'-0.02em', marginBottom:4 }}>{job.title}</div>
                <div style={{ fontSize:'0.9rem', color:'var(--text2)', fontWeight:500, marginBottom:10 }}>{job.company}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px' }}>
                  {[['📍', job.location], ['💰', job.salary], ['⏱', job.postedAt]].map(([ic, tx]) => (
                    <span key={tx} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', color:'var(--text3)' }}>
                      {ic} {tx}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:26 }}>
              {job.tags?.map(t => <span key={t} className="m-tag">{t}</span>)}
              <span style={{ padding:'7px 15px', borderRadius:10, fontSize:'0.8rem', fontWeight:700, ...ts }}>{job.type}</span>
            </div>

            {/* About */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>About the Role</div>
              <p style={{ fontSize:'0.9rem', color:'var(--text2)', lineHeight:1.75 }}>{job.description}</p>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Requirements</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {job.requirements?.map((r, i) => (
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.6 }}>
                    <span className="req-num">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Benefits & Perks</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {job.benefits?.map((b, i) => (
                  <div key={i} className="benefit-box">✦ {b}</div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display:'flex', gap:10 }}>
              <button
                className={`apply-btn ${isApplied ? 'done' : ''}`}
                onClick={handleApply}
                disabled={isApplied || applying}
              >
                {isApplied ? '✓ Application Sent!' : applying ? 'Sending…' : 'Apply Now →'}
              </button>
              <button
                className={`save-btn ${isSaved ? 'on' : ''}`}
                onClick={() => onSave(job)}
                title={isSaved ? 'Remove bookmark' : 'Save job'}
              >
                <svg width="21" height="21" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

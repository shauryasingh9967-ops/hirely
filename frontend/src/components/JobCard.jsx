// components/JobCard.jsx — Animated job listing card
import { useState } from 'react';

const typeStyle = {
  'Full-time': { bg:'var(--green-bg)', color:'var(--green)' },
  'Part-time': { bg:'var(--blue-bg)',  color:'var(--blue)'  },
  'Contract':  { bg:'var(--amber-bg)', color:'var(--amber)' },
  'Internship':{ bg:'rgba(244,113,181,0.08)', color:'#f471b5' },
};

export default function JobCard({ job, isSaved, isApplied, onSave, onClick, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const ts = typeStyle[job.type] || typeStyle['Full-time'];

  return (
    <>
      <style>{`
        .jcard {
          background:var(--bg2);border:1px solid var(--border);
          border-radius:var(--r);padding:24px;cursor:pointer;
          position:relative;overflow:hidden;
          transition:transform .3s cubic-bezier(0.34,1.56,0.64,1),
                     border-color .3s, box-shadow .3s;
          animation:cardIn .45s ease both;
        }
        .jcard:hover {
          transform:translateY(-6px);
          border-color:rgba(124,111,247,0.28);
          box-shadow:var(--shadow-lg),var(--glow2);
        }
        .jcard::before {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(124,111,247,0.05) 0%,transparent 60%);
          opacity:0;transition:opacity .3s;pointer-events:none;
        }
        .jcard:hover::before{opacity:1;}
        .jcard::after {
          content:'';position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,var(--accent),#f471b5,var(--blue));
          transform:scaleX(0);transform-origin:left;
          transition:transform .4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .jcard:hover::after{transform:scaleX(1);}
        .jcard .shimmer-sweep {
          position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.025) 50%,transparent 60%);
          transform:translateX(-100%);pointer-events:none;
        }
        .jcard:hover .shimmer-sweep{transform:translateX(100%);transition:transform .6s ease;}
        .jc-logo {
          transition:transform .3s cubic-bezier(0.34,1.56,0.64,1);
          position:relative;overflow:hidden;
        }
        .jc-logo::after{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:rgba(255,255,255,0.14);}
        .jcard:hover .jc-logo{transform:scale(1.08) rotate(-4deg);}
        .jc-title{transition:color .2s;}
        .jcard:hover .jc-title{color:var(--accent2);}
        .jc-tag{transition:all .2s;}
        .jcard:hover .jc-tag{
          background:rgba(124,111,247,0.08);
          border-color:rgba(124,111,247,0.2);
          color:var(--accent2);
        }
        .bm-btn{
          width:36px;height:36px;border-radius:10px;flex-shrink:0;
          background:var(--bg3);border:1px solid var(--border);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:all .2s;position:relative;z-index:1;
          color:var(--text3);
        }
        .bm-btn:hover,.bm-btn.on{
          background:rgba(124,111,247,0.1);
          border-color:rgba(124,111,247,0.28);
          color:var(--accent);
        }
        .bm-btn svg{width:15px;height:15px;transition:transform .2s;}
        .bm-btn:hover svg{transform:scale(1.15);}
      `}</style>

      <div
        className="jcard"
        style={{ animationDelay: `${index * 0.06}s` }}
        onClick={() => onClick(job)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="shimmer-sweep" />

        {/* Top row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:14 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div className="jc-logo" style={{
              width:48, height:48, borderRadius:14, flexShrink:0,
              background:job.color, display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:800, fontSize:'1.1rem',
              boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
            }}>
              {job.logo}
            </div>
            <div>
              <div className="jc-title" style={{ fontWeight:700, fontSize:'0.98rem', color:'var(--text)', lineHeight:1.25, marginBottom:3 }}>
                {job.title}
              </div>
              <div style={{ fontSize:'0.78rem', color:'var(--text3)', fontWeight:500 }}>{job.company}</div>
            </div>
          </div>

          <button
            className={`bm-btn ${isSaved ? 'on' : ''}`}
            onClick={e => { e.stopPropagation(); onSave(job); }}
            title={isSaved ? 'Remove bookmark' : 'Save job'}
          >
            <svg fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px 14px', marginBottom:12 }}>
          {[
            { icon:'📍', text: job.location },
            { icon:'💰', text: job.salary   },
            { icon:'⏱',  text: job.postedAt },
          ].map(m => (
            <span key={m.text} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem', color:'var(--text3)' }}>
              {m.icon} {m.text}
            </span>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
          {job.tags?.map(t => (
            <span key={t} className="jc-tag" style={{
              padding:'4px 11px', borderRadius:8,
              background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
              fontSize:'0.72rem', fontWeight:600, color:'var(--text3)', letterSpacing:'0.02em',
            }}>{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)' }}>
          <span style={{ padding:'5px 12px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, background:ts.bg, color:ts.color }}>
            {job.type}
          </span>
          {isApplied && (
            <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'var(--green)', fontWeight:700 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
              Applied
            </span>
          )}
        </div>
      </div>
    </>
  );
}

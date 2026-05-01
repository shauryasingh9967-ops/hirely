// pages/Home.jsx — Production-safe job listing page
import { useState, useEffect, useCallback, useRef } from 'react';
import JobCard      from '../components/JobCard';
import JobModal     from '../components/JobModal';
import SkeletonCard from '../components/SkeletonCard';
import { useAuth }  from '../context/AuthContext';
import api          from '../utils/api';

const QUICK_TABS = [
  { label:'✦ All Jobs',   val:'all'        },
  { label:'🌍 Remote',    val:'Remote'     },
  { label:'💼 Full-time', val:'Full-time'  },
  { label:'📋 Contract',  val:'Contract'   },
  { label:'⏰ Part-time', val:'Part-time'  },
  { label:'🎓 Internship',val:'Internship' },
];

export default function Home({ savedJobs, setSavedJobs, appliedJobs, setAppliedJobs, addToast }) {
  const { user } = useAuth();

  // ✅ Always initialize as array — never undefined
  const [jobs,     setJobs]     = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(false);

  // Filters
  const [query,    setQuery]    = useState('');
  const [locFil,   setLocFil]   = useState('All Locations');
  const [typeFil,  setTypeFil]  = useState('All Types');
  const [quick,    setQuick]    = useState('all');

  // Modal
  const [selected, setSelected] = useState(null);
  const debounceRef = useRef(null);

  // ✅ Production-safe fetch
  const fetchJobs = useCallback(async (reset = true) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: reset ? 1 : page, limit: 6 });
      if (query.trim())               params.set('q', query.trim());
      if (locFil !== 'All Locations') params.set('location', locFil);
      if (typeFil !== 'All Types')    params.set('type', typeFil);
      if (quick === 'Remote')         params.set('location', 'Remote');
      else if (quick !== 'all')       params.set('type', quick);

      const res = await api.get(`/jobs?${params}`);

      // ✅ Always fallback to [] — never let it be undefined
      const newJobs = res.data?.jobs ?? [];
      const newTotal = res.data?.total ?? 0;

      if (reset) {
        setJobs(newJobs);
        setPage(1);
      } else {
        setJobs(prev => [...(prev ?? []), ...newJobs]);
      }

      setTotal(newTotal);
      setHasMore((res.data?.page ?? 1) < (res.data?.pages ?? 1));

    } catch (err) {
      console.error('Fetch jobs error:', err);
      setError('Failed to load jobs. Please try again.');
      setJobs([]);   // ✅ Even on error — keep it as array
      setTotal(0);
      addToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false); // ✅ Always runs — no stuck loading
    }
  }, [query, locFil, typeFil, quick, page, addToast]);

  // Debounced fetch on filter change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchJobs(true), 280);
    return () => clearTimeout(debounceRef.current);
  }, [query, locFil, typeFil, quick]);

  // Load more
  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: nextPage, limit: 6 });
      if (query.trim())               params.set('q', query.trim());
      if (locFil !== 'All Locations') params.set('location', locFil);
      if (typeFil !== 'All Types')    params.set('type', typeFil);
      if (quick === 'Remote')         params.set('location', 'Remote');
      else if (quick !== 'all')       params.set('type', quick);

      const res = await api.get(`/jobs?${params}`);
      setJobs(prev => [...(prev ?? []), ...(res.data?.jobs ?? [])]);
      setPage(nextPage);
      setHasMore(res.data?.page < res.data?.pages);
    } catch { addToast('Failed to load more', 'error'); }
  };

  // ✅ Toggle Save
  const handleSave = async (job) => {
    if (!user) { addToast('Sign in to save jobs 🔒', 'info'); return; }
    try {
      const res = await api.post('/save', { jobId: job._id });
      setSavedJobs(prev => {
        const n = new Set(prev ?? []);
        res.data?.saved ? n.add(job._id) : n.delete(job._id);
        return n;
      });
      addToast(res.data?.saved ? `"${job.title}" saved! 🔖` : 'Removed from saved',
               res.data?.saved ? 'success' : 'info');
    } catch { addToast('Error saving job', 'error'); }
  };

  // ✅ Apply
  const handleApply = async (job) => {
    if (!user) { addToast('Sign in to apply 🔒', 'info'); return; }
    if ((appliedJobs ?? new Set()).has(job._id)) return;
    try {
      await api.post('/apply', { jobId: job._id });
      setAppliedJobs(prev => new Set([...(prev ?? []), job._id]));
      addToast(`Applied to ${job.title} at ${job.company}! 🎉`, 'success');
    } catch (e) {
      addToast(e.response?.data?.message || 'Apply failed', 'error');
    }
  };

  const clearAll = () => {
    setQuery(''); setLocFil('All Locations');
    setTypeFil('All Types'); setQuick('all');
  };

  // ✅ Double safety — always array
  const safeJobs = jobs ?? [];
  const hasFilters = query || locFil !== 'All Locations' || typeFil !== 'All Types' || quick !== 'all';

  return (
    <>
      <style>{`
        .hw{max-width:1140px;margin:0 auto;padding:0 24px 80px;position:relative;z-index:2;}
        .hero{padding:70px 0 50px;text-align:center;position:relative;}
        .hero::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:700px;height:380px;background:radial-gradient(ellipse,rgba(124,111,247,0.07) 0%,transparent 70%);pointer-events:none;}
        .eyb{display:inline-flex;align-items:center;gap:10px;padding:8px 18px;border-radius:99px;margin-bottom:26px;background:rgba(124,111,247,0.08);border:1px solid rgba(124,111,247,0.2);color:var(--accent2);font-size:0.8rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;animation:fadeDown .6s ease both;}
        .edot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulseGlow 2s infinite;}
        .hh{font-size:clamp(2.4rem,5.5vw,4.1rem);font-weight:800;line-height:1.08;letter-spacing:-0.04em;margin-bottom:18px;animation:fadeUp .65s .1s ease both;}
        .l1{display:block;color:var(--text);}
        .l2{display:block;background:linear-gradient(135deg,var(--accent2) 0%,#f471b5 45%,var(--blue) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200%;animation:gradShift 4s ease infinite alternate;}
        .hsub{font-size:1.05rem;color:var(--text2);max-width:460px;margin:0 auto 40px;line-height:1.7;animation:fadeUp .65s .2s ease both;}
        .hsts{display:flex;justify-content:center;flex-wrap:wrap;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;max-width:570px;margin:0 auto 54px;box-shadow:var(--shadow),var(--glow);animation:fadeUp .65s .3s ease both;}
        .hst{flex:1;min-width:110px;padding:20px 16px;text-align:center;position:relative;transition:background .2s;}
        .hst:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;height:60%;width:1px;background:var(--border);}
        .hst:hover{background:rgba(124,111,247,0.04);}
        .sv{font-weight:800;font-size:1.5rem;letter-spacing:-0.03em;color:var(--text);margin-bottom:3px;}
        .sl{font-size:0.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.07em;font-weight:600;}
        .sc{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r-xl);padding:10px;box-shadow:var(--shadow-lg),var(--glow);display:flex;flex-wrap:wrap;gap:8px;transition:border-color .3s,box-shadow .3s;animation:fadeUp .65s .4s ease both;max-width:860px;margin:0 auto;}
        .sc:focus-within{border-color:rgba(124,111,247,0.35);box-shadow:var(--shadow-lg),0 0 0 4px rgba(124,111,247,0.08);}
        .sf{flex:1;min-width:200px;display:flex;align-items:center;gap:12px;background:var(--bg3);border-radius:28px;padding:12px 18px;}
        .si{flex:1;border:none;background:transparent;color:var(--text);font-size:0.925rem;outline:none;font-family:inherit;}
        .si::placeholder{color:var(--text3);}
        .ss{background:var(--bg3);border:none;border-radius:28px;padding:12px 18px;color:var(--text2);font-size:0.875rem;font-weight:500;outline:none;cursor:pointer;font-family:inherit;transition:background .2s;}
        .ss:hover{background:var(--bg4);}
        .sb{padding:12px 28px;border-radius:28px;border:none;background:linear-gradient(135deg,var(--accent) 0%,var(--accent3) 100%);color:#fff;font-weight:700;font-size:0.875rem;cursor:pointer;box-shadow:0 4px 20px rgba(124,111,247,0.35);transition:all .25s;font-family:inherit;white-space:nowrap;}
        .sb:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,111,247,0.45);}
        .qtabs{display:flex;gap:8px;flex-wrap:wrap;margin:26px 0 18px;animation:fadeIn .5s .5s ease both;}
        .qt{padding:8px 18px;border-radius:99px;border:1px solid var(--border);background:transparent;color:var(--text3);font-size:0.8rem;font-weight:600;cursor:pointer;transition:all .2s;letter-spacing:0.02em;font-family:inherit;}
        .qt:hover{border-color:var(--border2);color:var(--text2);}
        .qt.on{background:rgba(124,111,247,0.1);border-color:rgba(124,111,247,0.3);color:var(--accent2);}
        .jg{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-bottom:32px;}
        .empty{grid-column:1/-1;text-align:center;padding:80px 24px;}
        .eico{font-size:4rem;margin-bottom:18px;display:inline-block;animation:emptyFloat 3s ease-in-out infinite;}
        .errbox{text-align:center;padding:60px 24px;grid-column:1/-1;}
        .lmb{display:block;margin:0 auto;padding:13px 36px;border-radius:14px;border:1px solid var(--border2);background:var(--bg2);color:var(--text2);font-weight:600;font-size:0.875rem;cursor:pointer;transition:all .25s;font-family:inherit;}
        .lmb:hover{border-color:rgba(124,111,247,0.35);color:var(--accent2);background:rgba(124,111,247,0.06);transform:translateY(-2px);}
        @media(max-width:640px){.hw{padding:0 16px 60px;}.hero{padding:48px 0 36px;}}
      `}</style>

      <div className="hw">
        {/* HERO */}
        <div className="hero">
          <div className="eyb"><span className="edot"/>Hiring is Live — Explore Opportunities</div>
          <h1 className="hh">
            <span className="l1">Your next big career</span>
            <span className="l2">move starts here.</span>
          </h1>
          <p className="hsub">Discover curated roles at world-class companies. No noise — just the best opportunities.</p>
          <div className="hsts">
            {[{v:total||'—',l:'Live Jobs'},{v:'40+',l:'Companies'},{v:'8',l:'Countries'},{v:'98%',l:'Match Rate'}].map(s => (
              <div key={s.l} className="hst">
                <div className="sv">{s.v}</div>
                <div className="sl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="sc">
          <div className="sf">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color:'var(--text3)',flexShrink:0}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input className="si" placeholder="Role, company, skill…" value={query}
              onChange={e => setQuery(e.target.value)}/>
            {query && <button onClick={() => setQuery('')} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:'1.1rem'}}>✕</button>}
          </div>
          <select className="ss" value={locFil} onChange={e => setLocFil(e.target.value)}>
            {['All Locations','Remote','San Francisco, CA','New York, NY','Austin, TX','Seattle, WA','Paris, France','Stockholm, Sweden'].map(l => <option key={l}>{l}</option>)}
          </select>
          <select className="ss" value={typeFil} onChange={e => setTypeFil(e.target.value)}>
            {['All Types','Full-time','Part-time','Contract','Internship'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="sb" onClick={() => fetchJobs(true)}>Search Jobs →</button>
        </div>

        {/* QUICK TABS */}
        <div className="qtabs">
          {QUICK_TABS.map(t => (
            <button key={t.val} className={`qt ${quick===t.val?'on':''}`} onClick={() => setQuick(t.val)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* RESULTS META */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginBottom:18}}>
          <div style={{fontSize:'0.85rem',color:'var(--text3)'}}>
            {/* ✅ Safe rendering — no crash */}
            {!loading && !error && (
              safeJobs.length > 0
                ? <span>Showing <strong style={{color:'var(--text2)'}}>{safeJobs.length}</strong> of <strong style={{color:'var(--text2)'}}>{total}</strong> jobs</span>
                : <span>No results found</span>
            )}
          </div>
          {hasFilters && (
            <button onClick={clearAll} style={{background:'none',border:'none',color:'var(--accent)',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',padding:'4px 10px',borderRadius:8,fontFamily:'inherit'}}>
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* JOB GRID */}
        <div className="jg">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i}/>)
          ) : error ? (
            // ✅ Error state — no blank screen
            <div className="errbox">
              <div style={{fontSize:'3rem',marginBottom:16}}>⚠️</div>
              <h3 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:8,color:'var(--text)'}}>Failed to load jobs</h3>
              <p style={{color:'var(--text3)',marginBottom:20}}>{error}</p>
              <button className="sb" onClick={() => fetchJobs(true)}>Try Again</button>
            </div>
          ) : safeJobs.length === 0 ? (
            <div className="empty">
              <div className="eico">🔭</div>
              <h3 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:8}}>No jobs found</h3>
              <p style={{color:'var(--text3)',marginBottom:22}}>Try different keywords or reset filters</p>
              <button className="sb" onClick={clearAll}>Reset Filters</button>
            </div>
          ) : (
            // ✅ Safe map — always works
            safeJobs.map((job, i) => (
              <JobCard
                key={job?._id ?? i}
                job={job}
                index={i}
                isSaved={(savedJobs ?? new Set()).has(job?._id)}
                isApplied={(appliedJobs ?? new Set()).has(job?._id)}
                onSave={handleSave}
                onClick={setSelected}
              />
            ))
          )}
        </div>

        {/* LOAD MORE */}
        {hasMore && !loading && !error && (
          <button className="lmb" onClick={loadMore}>
            Load More Jobs ({total - safeJobs.length} remaining) ↓
          </button>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <JobModal
          job={selected}
          isSaved={(savedJobs ?? new Set()).has(selected?._id)}
          isApplied={(appliedJobs ?? new Set()).has(selected?._id)}
          onSave={handleSave}
          onApply={handleApply}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

// components/SkeletonCard.jsx — Shimmer loading placeholder
export default function SkeletonCard() {
  return (
    <div style={card}>
      <div style={{ display:'flex', gap:13, alignItems:'center', marginBottom:16 }}>
        <div style={{ ...s, width:48, height:48, borderRadius:14 }} />
        <div>
          <div style={{ ...s, width:150, height:14, marginBottom:8 }} />
          <div style={{ ...s, width:90,  height:11 }} />
        </div>
      </div>
      <div style={{ ...s, width:'78%', height:11, marginBottom:10 }} />
      <div style={{ display:'flex', gap:7, marginBottom:14 }}>
        {[60,76,55].map(w => <div key={w} style={{ ...s, width:w, height:24, borderRadius:8 }} />)}
      </div>
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:12 }}>
        <div style={{ ...s, width:'35%', height:22, borderRadius:99 }} />
      </div>
    </div>
  );
}

const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:24 };
const s = {
  background:'linear-gradient(90deg,var(--bg3) 25%,var(--bg4) 50%,var(--bg3) 75%)',
  backgroundSize:'200% 100%', borderRadius:6,
  animation:'shimmerLoad 1.8s ease-in-out infinite',
};

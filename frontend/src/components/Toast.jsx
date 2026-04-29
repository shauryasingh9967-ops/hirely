// components/Toast.jsx
export default function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-ico">
            {t.type === 'success' ? '✓' : t.type === 'info' ? '◎' : '⚡'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

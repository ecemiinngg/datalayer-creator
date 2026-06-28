'use client';

interface Props {
  percentage: number;
  count: number;
  total: number;
  onReset: () => void;
}

export default function ProgressBar({ percentage, count, total, onReset }: Props) {
  const isDone = percentage === 100;

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {isDone ? (
        <div className="text-center py-2">
          <div className="text-3xl mb-2">🎉</div>
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>
            Tebrikler! sGTM kurulumun tamamlandı.
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            İlk server-side tracking altyapını başarıyla ayağa kaldırdın. Artık veriler ITP ve adblocker kısıtlamalarından bağımsız akıyor.
          </p>
          <button
            onClick={onReset}
            className="text-xs px-4 py-2 rounded-lg transition-all"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            Sıfırla
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                Kurulum İlerlemesi
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {count} / {total} adım tamamlandı
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                %{percentage}
              </span>
            </div>
          </div>

          {/* Track */}
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #7c5cfc, #a855f7)',
                boxShadow: '0 0 10px rgba(124, 92, 252, 0.5)',
              }}
            />
          </div>

          {/* Phase mini indicators */}
          <div className="flex gap-1.5 mt-3">
            {[
              { label: 'Altyapı', color: '#7c5cfc' },
              { label: 'Veri Akışı', color: '#06b6d4' },
              { label: 'Tagging', color: '#f59e0b' },
              { label: 'QA', color: '#22c55e' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{p.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

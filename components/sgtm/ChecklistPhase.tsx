'use client';

import type { ChecklistPhase as Phase, ChecklistStep } from '@/lib/checklistData';

interface Props {
  phase: Phase;
  completed: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (step: ChecklistStep) => void;
  selectedId: string | null;
}

export default function ChecklistPhase({ phase, completed, onToggle, onSelect, selectedId }: Props) {
  const phaseCompleted = phase.steps.every(s => completed.has(s.id));
  const phaseCount = phase.steps.filter(s => completed.has(s.id)).length;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
      {/* Phase Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: 'var(--surface2)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{phase.icon}</span>
          <div>
            <p className="text-xs font-semibold" style={{ color: phase.color, letterSpacing: '0.06em' }}>
              {phase.phase}
            </p>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              {phase.label}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phaseCompleted ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
              ✓ Tamamlandı
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {phaseCount}/{phase.steps.length}
            </span>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {phase.steps.map(step => {
          const isDone = completed.has(step.id);
          const isSelected = selectedId === step.id;

          return (
            <div
              key={step.id}
              className="flex items-start gap-4 px-5 py-4 transition-all cursor-pointer group"
              style={{
                background: isSelected ? 'rgba(124,92,252,0.06)' : 'transparent',
                borderLeft: isSelected ? `3px solid var(--accent)` : '3px solid transparent',
              }}
              onClick={() => onSelect(step)}
            >
              {/* Checkbox */}
              <button
                onClick={e => { e.stopPropagation(); onToggle(step.id); }}
                className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: isDone ? 'var(--accent)' : 'var(--surface2)',
                  border: `2px solid ${isDone ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  outline: 'none',
                }}
                aria-label={isDone ? 'Tamamlandı olarak işaretlendi' : 'Tamamlandı olarak işaretle'}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold leading-snug ${isDone ? 'line-through' : ''}`}
                  style={{ color: isDone ? 'var(--text-muted)' : 'var(--text)' }}
                >
                  {step.title}
                </p>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-dim)' }}>
                  {step.shortDesc}
                </p>
              </div>

              {/* Arrow */}
              <div
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

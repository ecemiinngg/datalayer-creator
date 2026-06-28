'use client';

import { useEffect, useRef } from 'react';
import type { ChecklistStep } from '@/lib/checklistData';

interface Props {
  step: ChecklistStep | null;
  onClose: () => void;
}

export default function ChecklistDrawer({ step, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!step) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [step, onClose]);

  useEffect(() => {
    if (step) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [step]);

  if (!step) return null;

  const codeLines = step.codeBlock?.code.split('\n') ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(600px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          animation: 'slideIn 0.3s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex-1 pr-4">
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Adım Detayı
            </p>
            <h2 className="text-lg font-bold leading-tight" style={{ color: 'var(--text)' }}>
              {step.title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {step.shortDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            aria-label="Kapat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Nedir */}
          <Section icon="📋" title="Ne Yapıyoruz?">
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
              {step.what}
            </p>
          </Section>

          {/* Neden */}
          <Section icon="💡" title="Neden Yapıyoruz?">
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
              {step.why}
            </p>
          </Section>

          {/* Code Block */}
          {step.codeBlock && (
            <Section icon="💻" title={step.codeBlock.label}>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between px-4 py-2" style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {step.codeBlock.language}
                  </span>
                  <CopyButton text={step.codeBlock.code} />
                </div>
                <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                  {codeLines.map((line, i) => (
                    <div key={i} className="flex">
                      <span className="select-none w-8 text-right mr-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>{i + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </Section>
          )}

          {/* Resources */}
          {step.resources.length > 0 && (
            <Section icon="🔗" title="Faydalı Kaynaklar">
              <div className="flex flex-col gap-2">
                {step.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group"
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: 'var(--accent)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </span>
                    <span className="flex-1">{r.label}</span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                      →
                    </span>
                  </a>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded transition-colors"
      style={{ color: 'var(--text-muted)', background: 'var(--border)', border: 'none', cursor: 'pointer' }}
    >
      Kopyala
    </button>
  );
}

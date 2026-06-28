'use client';

import { useState, useCallback } from 'react';
import { checklistData } from '@/lib/checklistData';
import { useChecklist } from '@/lib/useChecklist';
import ProgressBar from './ProgressBar';
import ChecklistPhase from './ChecklistPhase';
import ChecklistDrawer from './ChecklistDrawer';
import type { ChecklistStep } from '@/lib/checklistData';

export default function SgtmChecklist() {
  const { completed, toggle, reset, hydrated, count, total, percentage } = useChecklist();
  const [selectedStep, setSelectedStep] = useState<ChecklistStep | null>(null);

  const handleClose = useCallback(() => setSelectedStep(null), []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="animate-spin w-6 h-6 rounded-full border-2" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-30" style={{ borderColor: 'var(--border)', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
              🛰️
            </div>
            <div>
              <h1 className="text-sm font-bold" style={{ color: 'var(--text)' }}>sGTM Setup Checklist</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Server-Side Google Tag Manager Kurulum Rehberi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {count}/{total} adım
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Hero */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Adım Adım sGTM Kurulum Rehberi
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            GA4, Meta CAPI ve TikTok Events API entegrasyonlarını içeren eksiksiz server-side tracking altyapısı.
            Her adıma tıklayarak teknik detaylara ulaşabilirsin.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          percentage={percentage}
          count={count}
          total={total}
          onReset={reset}
        />

        {/* Phases */}
        <div className="space-y-4">
          {checklistData.map(phase => (
            <ChecklistPhase
              key={phase.id}
              phase={phase}
              completed={completed}
              onToggle={toggle}
              onSelect={setSelectedStep}
              selectedId={selectedStep?.id ?? null}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            İlerlemen local storage\'a kaydedilir. Sayfayı kapattıktan sonra da devam edebilirsin.
          </p>
        </div>
      </main>

      {/* Drawer */}
      <ChecklistDrawer step={selectedStep} onClose={handleClose} />
    </div>
  );
}

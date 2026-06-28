'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTotalSteps } from './checklistData';

const STORAGE_KEY = 'sgtm_checklist_v1';

export function useChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompleted(new Set(JSON.parse(saved)));
      }
    } catch {}
    setHydrated(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCompleted(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const total = getTotalSteps();
  const count = completed.size;
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return { completed, toggle, reset, hydrated, count, total, percentage };
}

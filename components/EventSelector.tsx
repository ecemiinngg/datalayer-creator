'use client';

import { useState } from 'react';
import type { GA4Event } from '@/types';
import { GA4_EVENTS, CUSTOM_EVENT_TEMPLATE } from '@/lib/events';

interface EventSelectorProps {
  selected: GA4Event;
  onSelect: (event: GA4Event) => void;
}

const CATEGORIES = [
  { key: 'ecommerce', label: 'E-Commerce' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'game', label: 'Game' },
  { key: 'lead', label: 'Lead' },
  { key: 'custom', label: 'Custom' },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  ecommerce: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  engagement: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  game: 'bg-purple-50 text-purple-700 border-purple-200',
  lead: 'bg-rose-50 text-rose-700 border-rose-200',
  custom: 'bg-orange-50 text-orange-700 border-orange-200',
};

const TAB_ACTIVE: Record<string, string> = {
  ecommerce: 'bg-indigo-600 text-white',
  engagement: 'bg-emerald-600 text-white',
  game: 'bg-purple-600 text-white',
  lead: 'bg-rose-600 text-white',
  custom: 'bg-orange-500 text-white',
};

export default function EventSelector({ selected, onSelect }: EventSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]['key']>('ecommerce');
  const [search, setSearch] = useState('');

  const allEvents = [...GA4_EVENTS, CUSTOM_EVENT_TEMPLATE];
  const filtered = allEvents.filter(
    (e) =>
      e.category === activeCategory &&
      (search === '' || e.name.includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Category tabs — two rows to avoid overflow */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {CATEGORIES.slice(0, 3).map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${
                activeCategory === cat.key ? TAB_ACTIVE[cat.key] : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {CATEGORIES.slice(3).map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${
                activeCategory === cat.key ? TAB_ACTIVE[cat.key] : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      {activeCategory !== 'custom' && (
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
          </svg>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
      )}

      {/* Event list */}
      <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
        {filtered.map((event) => (
          <button
            key={event.name}
            onClick={() => onSelect(event)}
            className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
              selected.name === event.name
                ? CATEGORY_COLORS[event.category] + ' border-current shadow-sm'
                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <code className="text-xs font-bold">{event.name}</code>
              {selected.name === event.name && (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{event.description}</p>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No results found.</p>
        )}
      </div>
    </div>
  );
}

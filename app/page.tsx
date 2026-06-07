'use client';

import { useState, useMemo, useCallback } from 'react';
import type { GA4Event, EventParameter, ParameterValues, OutputTab } from '@/types';
import { GA4_EVENTS } from '@/lib/events';
import { generateDataLayerCode } from '@/lib/code-generator';
import { buildGTMContainer } from '@/lib/gtm-builder';
import { generateQAChecklist } from '@/lib/qa-generator';
import EventSelector from '@/components/EventSelector';
import ParameterForm from '@/components/ParameterForm';
import CustomParamBuilder from '@/components/CustomParamBuilder';
import CodePreview from '@/components/CodePreview';

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<GA4Event>(GA4_EVENTS[3]); // add_to_cart default
  const [paramValues, setParamValues] = useState<ParameterValues>({});
  const [activeTab, setActiveTab] = useState<OutputTab>('js');
  const [customEventName, setCustomEventName] = useState('my_custom_event');
  const [customParams, setCustomParams] = useState<EventParameter[]>([]);

  const effectiveEvent: GA4Event = useMemo(() => {
    if (selectedEvent.category === 'custom') {
      return {
        ...selectedEvent,
        name: customEventName.trim() || 'custom_event',
        parameters: customParams,
      };
    }
    return selectedEvent;
  }, [selectedEvent, customEventName, customParams]);

  const handleEventSelect = useCallback((event: GA4Event) => {
    setSelectedEvent(event);
    setParamValues({});
  }, []);

  const handleParamChange = useCallback((key: string, value: string | number) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const jsCode = useMemo(
    () => generateDataLayerCode(effectiveEvent, paramValues),
    [effectiveEvent, paramValues]
  );

  const gtmJson = useMemo(
    () => JSON.stringify(buildGTMContainer([effectiveEvent]), null, 2),
    [effectiveEvent]
  );

  const qaMarkdown = useMemo(
    () => generateQAChecklist(effectiveEvent, paramValues),
    [effectiveEvent, paramValues]
  );

  const isCustom = selectedEvent.category === 'custom';

  const editableParams = effectiveEvent.parameters.filter((p) => p.type !== 'array');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center text-lg font-black">
              DL
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">DataLayer Creator</h1>
              <p className="text-xs text-indigo-300">GA4 & GTM Tracking Spec Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              GA4 Compatible
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              GTM API v2
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-5">
        {/* Left panel */}
        <aside className="lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0">
          {/* Step 1: Event selector */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-xs">1</span>
              Select Event
            </h2>
            <EventSelector selected={selectedEvent} onSelect={handleEventSelect} />
          </div>

          {/* Custom: event name */}
          {isCustom && (
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
              <label className="text-xs font-semibold text-orange-700 mb-1 block">Event Name</label>
              <input
                type="text"
                value={customEventName}
                onChange={(e) => setCustomEventName(e.target.value)}
                placeholder="my_custom_event"
                className="w-full text-sm font-mono border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>
          )}

          {/* Custom: parameter builder */}
          {isCustom && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-xs">2</span>
                Define Parameters
              </h2>
              <CustomParamBuilder params={customParams} onChange={setCustomParams} />
            </div>
          )}

          {/* Standard: fill values */}
          {!isCustom && editableParams.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-xs">2</span>
                Fill Parameters
                <span className="ml-auto text-xs font-normal text-red-400">* required</span>
              </h2>
              <ParameterForm
                event={effectiveEvent}
                values={paramValues}
                onChange={handleParamChange}
              />
            </div>
          )}

          {/* Event info badge */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-600 font-mono">{effectiveEvent.name}</p>
            <p>{effectiveEvent.description}</p>
            {effectiveEvent.parameters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {effectiveEvent.parameters.map((p) => (
                  <span
                    key={p.name || Math.random()}
                    className={`px-2 py-0.5 rounded-full text-xs font-mono border ${
                      p.required
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {p.name || '…'}{p.required ? '*' : '?'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right panel */}
        <section className="flex-1 min-h-[600px] lg:min-h-0">
          <CodePreview
            activeTab={activeTab}
            onTabChange={setActiveTab}
            jsCode={jsCode}
            gtmJson={gtmJson}
            qaMarkdown={qaMarkdown}
            event={effectiveEvent}
          />
        </section>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200">
        DataLayer Creator — Automated dataLayer code, GTM container & QA checklist for GA4 events
      </footer>
    </div>
  );
}

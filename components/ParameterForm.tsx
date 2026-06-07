'use client';

import type { GA4Event, ParameterValues } from '@/types';

interface ParameterFormProps {
  event: GA4Event;
  values: ParameterValues;
  onChange: (key: string, value: string | number) => void;
}

export default function ParameterForm({ event, values, onChange }: ParameterFormProps) {
  const editableParams = event.parameters.filter((p) => p.type !== 'array');

  if (editableParams.length === 0) {
    return (
      <div className="text-sm text-slate-400 italic px-1">
        No editable parameters for this event (items array is auto-generated).
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {editableParams.map((param) => (
        <div key={param.name}>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">{param.name}</code>
            <span className="text-slate-400 font-normal capitalize">{param.type}</span>
            {param.required && (
              <span className="text-red-500 font-bold text-xs">*</span>
            )}
          </label>
          {param.description && (
            <p className="text-xs text-slate-400 mb-1">{param.description}</p>
          )}
          <input
            type={param.type === 'number' ? 'number' : 'text'}
            placeholder={String(param.example ?? `<${param.name}>`)}
            value={values[param.name] !== undefined ? String(values[param.name]) : ''}
            onChange={(e) => {
              const raw = e.target.value;
              const val = param.type === 'number' ? (raw === '' ? '' : Number(raw)) : raw;
              onChange(param.name, val as string | number);
            }}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white text-slate-800 placeholder-slate-300"
          />
        </div>
      ))}
    </div>
  );
}

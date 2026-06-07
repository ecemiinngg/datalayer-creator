'use client';

import type { EventParameter, ParameterType } from '@/types';

interface CustomParamBuilderProps {
  params: EventParameter[];
  onChange: (params: EventParameter[]) => void;
}

const TYPES: ParameterType[] = ['string', 'number', 'boolean', 'array'];

export default function CustomParamBuilder({ params, onChange }: CustomParamBuilderProps) {
  const addParam = () => {
    onChange([
      ...params,
      { name: '', type: 'string', required: false, description: '', example: '' },
    ]);
  };

  const removeParam = (idx: number) => {
    onChange(params.filter((_, i) => i !== idx));
  };

  const updateParam = (idx: number, field: keyof EventParameter, value: string | boolean) => {
    onChange(
      params.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {params.map((param, idx) => (
        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="parameter_name"
              value={param.name}
              onChange={(e) => updateParam(idx, 'name', e.target.value)}
              className="flex-1 text-xs font-mono border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <select
              value={param.type}
              onChange={(e) => updateParam(idx, 'type', e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => removeParam(idx)}
              className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Remove parameter"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Example value"
              value={String(param.example ?? '')}
              onChange={(e) => updateParam(idx, 'example', e.target.value)}
              className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={param.required}
                onChange={(e) => updateParam(idx, 'required', e.target.checked)}
                className="accent-indigo-600"
              />
              Required
            </label>
          </div>
        </div>
      ))}

      <button
        onClick={addParam}
        className="flex items-center justify-center gap-2 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Parameter
      </button>
    </div>
  );
}

'use client';

import type { OutputTab, GA4Event } from '@/types';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';

interface CodePreviewProps {
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  jsCode: string;
  gtmJson: string;
  qaMarkdown: string;
  event: GA4Event;
}

const TABS: { key: OutputTab; label: string; icon: string }[] = [
  { key: 'js', label: 'JS Code', icon: '⚡' },
  { key: 'gtm', label: 'GTM JSON', icon: '📦' },
  { key: 'qa', label: 'QA Checklist', icon: '✅' },
];

export default function CodePreview({
  activeTab,
  onTabChange,
  jsCode,
  gtmJson,
  qaMarkdown,
  event,
}: CodePreviewProps) {
  const content = activeTab === 'js' ? jsCode : activeTab === 'gtm' ? gtmJson : qaMarkdown;

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-xl overflow-hidden border border-gray-800">
      {/* Tab bar */}
      <div className="flex items-center bg-gray-900 border-b border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-500 text-indigo-400 bg-gray-950'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 px-3 py-2">
          <CopyButton text={content} />
          {activeTab === 'gtm' && (
            <DownloadButton
              content={gtmJson}
              filename={`gtm-container-${event.name}.json`}
              mimeType="application/json"
              label="Download GTM JSON"
            />
          )}
          {activeTab === 'qa' && (
            <DownloadButton
              content={qaMarkdown}
              filename={`qa-checklist-${event.name}.md`}
              mimeType="text/markdown"
              label="Download MD"
            />
          )}
          {activeTab === 'js' && (
            <DownloadButton
              content={jsCode}
              filename={`datalayer-${event.name}.js`}
              mimeType="text/javascript"
              label="Download JS"
            />
          )}
        </div>
      </div>

      {/* Window dots */}
      {activeTab !== 'qa' && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 border-b border-gray-800">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
          <span className="ml-3 text-xs text-gray-600 font-mono">
            {activeTab === 'js' ? `datalayer-${event.name}.js` : `gtm-container-${event.name}.json`}
          </span>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-auto code-scroll">
        {activeTab === 'qa' ? (
          <div className="p-6 text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
            <QARenderer markdown={qaMarkdown} />
          </div>
        ) : (
          <pre className="p-5 text-sm leading-relaxed font-mono text-green-400 whitespace-pre overflow-x-auto">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}

function QARenderer({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n');

  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className="text-xl font-bold text-white mt-2 mb-3">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-base font-semibold text-indigo-400 mt-5 mb-2">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-sm font-semibold text-emerald-400 mt-3 mb-1">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith('- [ ] ')) {
          return (
            <label key={i} className="flex items-start gap-2 py-0.5 cursor-pointer group">
              <input type="checkbox" className="mt-0.5 accent-indigo-500 cursor-pointer" />
              <span className="text-gray-300 group-hover:text-white transition-colors text-xs leading-relaxed">
                <InlineCode text={line.slice(6)} />
              </span>
            </label>
          );
        }
        if (line.startsWith('  ```') || line === '  ```') {
          return null;
        }
        if (line.startsWith('  ') && !line.startsWith('  - [ ]')) {
          return (
            <code key={i} className="block ml-6 text-xs text-yellow-300 bg-gray-800 px-2 py-0.5 rounded my-0.5">
              {line.trim()}
            </code>
          );
        }
        if (line.startsWith('> ')) {
          return (
            <p key={i} className="text-xs text-gray-500 italic">
              {line.slice(2)}
            </p>
          );
        }
        if (line === '---') {
          return <hr key={i} className="border-gray-800 my-3" />;
        }
        if (line === '') {
          return <div key={i} className="h-1" />;
        }
        return (
          <p key={i} className="text-xs text-gray-400">
            <InlineCode text={line} />
          </p>
        );
      })}
    </div>
  );
}

function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="bg-gray-800 text-yellow-300 px-1 rounded text-xs">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

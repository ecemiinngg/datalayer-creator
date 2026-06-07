import type { GA4Event, ParameterValues } from '@/types';
import { ECOMMERCE_ITEM_SCHEMA } from './events';

function getExampleValue(param: { type: string; example?: string | number | boolean; name: string }): string | number | boolean {
  if (param.example !== undefined) return param.example;
  if (param.type === 'number') return 0;
  if (param.type === 'boolean') return true;
  return `<${param.name}>`;
}

function formatValue(val: string | number | boolean | object): string {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

function indentLines(str: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n');
}

export function generateDataLayerCode(event: GA4Event, paramValues: ParameterValues): string {
  const ecommerceParams = event.useEcommerceObject
    ? event.parameters
    : [];
  const topLevelParams = event.useEcommerceObject
    ? []
    : event.parameters;

  const lines: string[] = [];
  lines.push('window.dataLayer = window.dataLayer || [];');
  lines.push('window.dataLayer.push({');

  if (event.useEcommerceObject) {
    lines.push(`  event: "${event.name}",`);
    lines.push('  ecommerce: {');

    ecommerceParams.forEach((param, idx) => {
      const isLast = idx === ecommerceParams.length - 1;
      const comma = isLast ? '' : ',';

      if (param.type === 'array' && param.schema === 'ecommerce_item') {
        const itemJson = JSON.stringify([ECOMMERCE_ITEM_SCHEMA], null, 4);
        const indented = itemJson
          .split('\n')
          .map((line, i) => (i === 0 ? line : '    ' + line))
          .join('\n');
        lines.push(`    ${param.name}: ${indented}${comma}`);
      } else {
        const rawVal = paramValues[param.name];
        const val = rawVal !== undefined && rawVal !== '' ? rawVal : getExampleValue(param);
        lines.push(`    ${param.name}: ${formatValue(val)}${comma}`);
      }
    });

    lines.push('  }');
  } else {
    lines.push(`  event: "${event.name}",`);

    topLevelParams.forEach((param, idx) => {
      const isLast = idx === topLevelParams.length - 1;
      const comma = isLast ? '' : ',';
      const rawVal = paramValues[param.name];
      const val = rawVal !== undefined && rawVal !== '' ? rawVal : getExampleValue(param);
      lines.push(`  ${param.name}: ${formatValue(val)}${comma}`);
    });
  }

  lines.push('});');

  void indentLines; // suppress lint
  return lines.join('\n');
}

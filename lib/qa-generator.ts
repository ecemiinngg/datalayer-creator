import type { GA4Event, ParameterValues } from '@/types';

export function generateQAChecklist(event: GA4Event, _paramValues: ParameterValues): string {
  const hasEcommerce = event.useEcommerceObject;
  const requiredParams = event.parameters.filter((p) => p.required);
  const numericParams = event.parameters.filter((p) => p.type === 'number');
  const arrayParams = event.parameters.filter((p) => p.type === 'array');
  const prefix = hasEcommerce ? 'ecommerce.' : '';

  const lines: string[] = [];

  lines.push(`# QA Checklist: \`${event.name}\``);
  lines.push('');
  lines.push(`> **Event:** \`${event.name}\`  `);
  lines.push(`> **Category:** ${event.category}  `);
  lines.push(`> **Description:** ${event.description}`);
  lines.push('');

  lines.push('## 1. Developer Verification');
  lines.push('');
  lines.push('- [ ] Open DevTools with **F12** and switch to the **Console** tab.');
  lines.push(`- [ ] Perform the relevant action (${event.description}).`);
  lines.push('- [ ] Run the following in the console:');
  lines.push('  ```js');
  lines.push(`  window.dataLayer.filter(d => d.event === "${event.name}")`);
  lines.push('  ```');
  lines.push(`- [ ] Confirm the result contains an object with \`event: "${event.name}"\`.`);
  if (hasEcommerce) {
    lines.push('- [ ] Confirm the \`ecommerce\` object is present inside the pushed object.');
  }

  lines.push('');
  lines.push('## 2. Parameter Validation');
  lines.push('');

  if (requiredParams.length === 0 && numericParams.length === 0 && arrayParams.length === 0) {
    lines.push('- [ ] Confirm the event fires without additional required parameters.');
  }

  requiredParams.forEach((p) => {
    if (p.type === 'array') {
      lines.push(`- [ ] \`${prefix}${p.name}\` is an **array** and is **non-empty** (at least 1 item).`);
    } else {
      lines.push(`- [ ] \`${prefix}${p.name}\` is present and **not empty** (required field).`);
    }
  });

  numericParams.forEach((p) => {
    lines.push(
      `- [ ] \`${prefix}${p.name}\` is a **number** type (not a string). Example: \`${p.example ?? 0}\`.`
    );
  });

  if (arrayParams.length > 0) {
    lines.push('');
    lines.push('### items Array Check');
    lines.push('');
    lines.push('- [ ] Each item object contains at least \`item_id\` or \`item_name\`.');
    lines.push('- [ ] \`price\` field is a number type.');
    lines.push('- [ ] \`quantity\` field is a positive integer.');
  }

  lines.push('');
  lines.push('## 3. Network Tab Verification');
  lines.push('');
  lines.push('- [ ] Open the **Network** tab and filter by `collect` or `g/collect`.');
  lines.push(`- [ ] After triggering the action, find the GA4 request fired for \`${event.name}\`.`);
  lines.push(`- [ ] Confirm the request includes \`en=${event.name}\` in the payload.`);
  if (hasEcommerce) {
    lines.push('- [ ] Confirm ecommerce product parameters (pr1, pr2…) are present in the request.');
  }

  lines.push('');
  lines.push('## 4. GTM Preview Verification');
  lines.push('');
  lines.push('- [ ] Open GTM and click **Preview** (Submit → Preview).');
  lines.push('- [ ] Reload the page and perform the test action.');
  lines.push(`- [ ] In the left panel, find the **"${event.name}"** event and click it.`);
  lines.push(`- [ ] Confirm the \`GA4 - ${event.name}\` tag shows **"Succeeded"** status.`);
  lines.push('- [ ] Under the **Variables** tab, verify all Data Layer Variables are populated.');

  lines.push('');
  lines.push('## 5. GA4 DebugView Verification');
  lines.push('');
  lines.push('- [ ] Go to GA4 Admin > DebugView.');
  lines.push(`- [ ] Confirm \`${event.name}\` appears in the event stream.`);
  lines.push('- [ ] Click the event and verify all parameters are present with correct values.');

  if (event.name === 'purchase') {
    lines.push('');
    lines.push('## 6. Purchase-Specific Checks');
    lines.push('');
    lines.push('- [ ] Confirm the same `transaction_id` is NOT fired twice (no duplicate purchases).');
    lines.push('- [ ] Check GA4 > Reports > Monetization > Ecommerce purchases — confirm the sale appears.');
  }

  if (event.category === 'game') {
    lines.push('');
    lines.push('## 6. Game Event Checks');
    lines.push('');
    lines.push('- [ ] Confirm the event fires only once per user action (no duplicate triggers).');
    lines.push('- [ ] Verify numeric fields (score, level, value) are number type, not strings.');
    lines.push('- [ ] Check event fires on both mobile and desktop browsers.');
  }

  if (event.category === 'lead') {
    lines.push('');
    lines.push('## 6. Lead Event Checks');
    lines.push('');
    lines.push('- [ ] Confirm the event fires only after a successful form submit (not on every click).');
    lines.push('- [ ] Verify the event does NOT fire if the form has validation errors.');
    lines.push('- [ ] Check that no PII (email, name, phone) is sent as a GA4 parameter.');
  }

  if (event.category === 'custom') {
    lines.push('');
    lines.push('## 6. Custom Event Checks');
    lines.push('');
    lines.push('- [ ] Confirm the custom event name matches exactly what was agreed with your analytics team.');
    lines.push('- [ ] Verify all custom parameters are registered as custom dimensions/metrics in GA4.');
    lines.push('- [ ] Test in at least two different browsers.');
  }

  lines.push('');
  lines.push('---');
  lines.push(`*Generated by DataLayer Creator for \`${event.name}\` event.*`);

  return lines.join('\n');
}

import type { GA4Event } from '@/types';

let idCounter = 1;
const nextId = () => idCounter++;

interface GTMVariable {
  accountId: string;
  containerId: string;
  variableId: string;
  name: string;
  type: string;
  parameter: { type: string; key: string; value: string }[];
  fingerprint: string;
}

interface GTMTrigger {
  accountId: string;
  containerId: string;
  triggerId: string;
  name: string;
  type: string;
  customEventFilter: { type: string; parameter: { type: string; key: string; value: string }[] }[];
  fingerprint: string;
}

interface GTMTag {
  accountId: string;
  containerId: string;
  tagId: string;
  name: string;
  type: string;
  parameter: { type: string; key: string; value: string }[];
  firingTriggerId: string[];
  fingerprint: string;
}

export function buildGTMContainer(events: GA4Event[]): object {
  idCounter = 100;

  const accountId = '1234567';
  const containerId = '9876543';
  const publicId = 'GTM-XXXXXXX';

  const variables: GTMVariable[] = [];
  const triggers: GTMTrigger[] = [];
  const tags: GTMTag[] = [];

  const varMap: Record<string, string> = {};

  events.forEach((event) => {
    const triggerId = String(nextId());
    triggers.push({
      accountId,
      containerId,
      triggerId,
      name: `CE - ${event.name}`,
      type: 'CUSTOM_EVENT',
      customEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            { type: 'TEMPLATE', key: 'arg0', value: '{{_event}}' },
            { type: 'TEMPLATE', key: 'arg1', value: event.name },
          ],
        },
      ],
      fingerprint: String(Date.now()),
    });

    const tagParams: { type: string; key: string; value: string }[] = [
      { type: 'TEMPLATE', key: 'eventName', value: event.name },
    ];

    event.parameters
      .filter((p) => p.type !== 'array')
      .forEach((param) => {
        const varKey = `${event.name}_${param.name}`;
        if (!varMap[varKey]) {
          const varId = String(nextId());
          varMap[varKey] = varId;

          const dlvPath = event.useEcommerceObject
            ? `ecommerce.${param.name}`
            : param.name;

          variables.push({
            accountId,
            containerId,
            variableId: varId,
            name: `DLV - ${event.name} - ${param.name}`,
            type: 'v',
            parameter: [
              { type: 'INTEGER', key: 'dataLayerVersion', value: '2' },
              { type: 'BOOLEAN', key: 'setDefaultValue', value: 'false' },
              { type: 'TEMPLATE', key: 'name', value: dlvPath },
            ],
            fingerprint: String(Date.now()),
          });
        }

        tagParams.push({
          type: 'LIST',
          key: 'eventParameters',
          value: JSON.stringify([
            {
              type: 'MAP',
              map: [
                { type: 'TEMPLATE', key: 'name', value: param.name },
                {
                  type: 'TEMPLATE',
                  key: 'value',
                  value: `{{DLV - ${event.name} - ${param.name}}}`,
                },
              ],
            },
          ]),
        });
      });

    const tagId = String(nextId());
    tags.push({
      accountId,
      containerId,
      tagId,
      name: `GA4 - ${event.name}`,
      type: 'gaawe',
      parameter: tagParams,
      firingTriggerId: [triggerId],
      fingerprint: String(Date.now()),
    });
  });

  return {
    exportFormatVersion: 2,
    exportTime: new Date().toISOString(),
    containerVersion: {
      path: `accounts/${accountId}/containers/${containerId}/versions/0`,
      accountId,
      containerId,
      containerVersionId: '0',
      container: {
        path: `accounts/${accountId}/containers/${containerId}`,
        accountId,
        containerId,
        name: 'DataLayer Creator Export',
        publicId,
        usageContext: ['WEB'],
        fingerprint: String(Date.now()),
        tagManagerUrl: `https://tagmanager.google.com/#/container/accounts/${accountId}/containers/${containerId}/workspaces/2`,
      },
      variable: variables,
      trigger: triggers,
      tag: tags,
      fingerprint: String(Date.now()),
    },
  };
}

export type ParameterType = 'string' | 'number' | 'boolean' | 'array';

export interface EventParameter {
  name: string;
  type: ParameterType;
  required: boolean;
  description?: string;
  example?: string | number | boolean;
  schema?: 'ecommerce_item';
}

export interface GA4Event {
  name: string;
  category: 'ecommerce' | 'engagement' | 'game' | 'lead' | 'custom';
  description: string;
  parameters: EventParameter[];
  useEcommerceObject?: boolean;
}

export interface ParameterValues {
  [key: string]: string | number | boolean;
}

export type OutputTab = 'js' | 'gtm' | 'qa';

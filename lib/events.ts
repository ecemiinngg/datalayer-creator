import type { GA4Event } from '@/types';

export const ECOMMERCE_ITEM_SCHEMA = {
  item_id: 'SKU_12345',
  item_name: 'Stan and Friends Tee',
  item_brand: 'Google',
  item_category: 'Apparel',
  price: 9.99,
  quantity: 1,
};

export const GA4_EVENTS: GA4Event[] = [
  // ─── E-Commerce ───────────────────────────────────────────────
  {
    name: 'view_item_list',
    category: 'ecommerce',
    description: 'Fired when a user sees a list of products.',
    useEcommerceObject: true,
    parameters: [
      { name: 'item_list_id', type: 'string', required: false, example: 'related_products', description: 'List identifier' },
      { name: 'item_list_name', type: 'string', required: false, example: 'Related Products', description: 'List name' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Products shown in the list' },
    ],
  },
  {
    name: 'select_item',
    category: 'ecommerce',
    description: 'Fired when a user clicks a product in a list.',
    useEcommerceObject: true,
    parameters: [
      { name: 'item_list_id', type: 'string', required: false, example: 'related_products', description: 'List identifier' },
      { name: 'item_list_name', type: 'string', required: false, example: 'Related Products', description: 'List name' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Selected product' },
    ],
  },
  {
    name: 'view_item',
    category: 'ecommerce',
    description: 'Fired when a user views a product detail page.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code (ISO 4217)' },
      { name: 'value', type: 'number', required: true, example: 9.99, description: 'Total value' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Viewed product' },
    ],
  },
  {
    name: 'add_to_cart',
    category: 'ecommerce',
    description: 'Fired when a user adds a product to the cart.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'value', type: 'number', required: true, example: 9.99, description: 'Value of added item(s)' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Items added to cart' },
    ],
  },
  {
    name: 'remove_from_cart',
    category: 'ecommerce',
    description: 'Fired when a user removes a product from the cart.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'value', type: 'number', required: true, example: 9.99, description: 'Value of removed item(s)' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Items removed from cart' },
    ],
  },
  {
    name: 'view_cart',
    category: 'ecommerce',
    description: 'Fired when a user views the cart.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'value', type: 'number', required: true, example: 25.42, description: 'Cart total' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Items in cart' },
    ],
  },
  {
    name: 'begin_checkout',
    category: 'ecommerce',
    description: 'Fired when a user begins the checkout process.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'value', type: 'number', required: true, example: 25.42, description: 'Checkout total' },
      { name: 'coupon', type: 'string', required: false, example: 'SUMMER21', description: 'Coupon code' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Items being purchased' },
    ],
  },
  {
    name: 'add_shipping_info',
    category: 'ecommerce',
    description: 'Fired when a user submits shipping information.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'value', type: 'number', required: true, example: 25.42, description: 'Total value' },
      { name: 'coupon', type: 'string', required: false, example: 'SUMMER21', description: 'Coupon code' },
      { name: 'shipping_tier', type: 'string', required: false, example: 'Ground', description: 'Shipping method' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Items' },
    ],
  },
  {
    name: 'add_payment_info',
    category: 'ecommerce',
    description: 'Fired when a user submits payment information.',
    useEcommerceObject: true,
    parameters: [
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'value', type: 'number', required: true, example: 25.42, description: 'Total value' },
      { name: 'coupon', type: 'string', required: false, example: 'SUMMER21', description: 'Coupon code' },
      { name: 'payment_type', type: 'string', required: false, example: 'Credit Card', description: 'Payment method' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Items' },
    ],
  },
  {
    name: 'purchase',
    category: 'ecommerce',
    description: 'Fired when a user completes a purchase.',
    useEcommerceObject: true,
    parameters: [
      { name: 'transaction_id', type: 'string', required: true, example: 'T_12345', description: 'Unique transaction ID' },
      { name: 'value', type: 'number', required: true, example: 25.42, description: 'Revenue (excl. tax)' },
      { name: 'tax', type: 'number', required: false, example: 4.90, description: 'Tax amount' },
      { name: 'shipping', type: 'number', required: false, example: 5.99, description: 'Shipping cost' },
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'coupon', type: 'string', required: false, example: 'SUMMER21', description: 'Coupon code' },
      { name: 'items', type: 'array', required: true, schema: 'ecommerce_item', description: 'Purchased items' },
    ],
  },
  {
    name: 'refund',
    category: 'ecommerce',
    description: 'Fired when a refund is issued.',
    useEcommerceObject: true,
    parameters: [
      { name: 'transaction_id', type: 'string', required: true, example: 'T_12345', description: 'Transaction ID to refund' },
      { name: 'value', type: 'number', required: false, example: 25.42, description: 'Refunded amount' },
      { name: 'currency', type: 'string', required: true, example: 'USD', description: 'Currency code' },
      { name: 'items', type: 'array', required: false, schema: 'ecommerce_item', description: 'Refunded items (partial refund)' },
    ],
  },

  // ─── Engagement ───────────────────────────────────────────────
  {
    name: 'page_view',
    category: 'engagement',
    description: 'Fired when a page is viewed (use manually for SPA route changes).',
    parameters: [
      { name: 'page_title', type: 'string', required: false, example: 'Product Page', description: 'Page title' },
      { name: 'page_location', type: 'string', required: false, example: 'https://example.com/product', description: 'Full URL' },
      { name: 'page_path', type: 'string', required: false, example: '/product/123', description: 'URL path' },
    ],
  },
  {
    name: 'search',
    category: 'engagement',
    description: 'Fired when a user performs a site search.',
    parameters: [
      { name: 'search_term', type: 'string', required: true, example: 't-shirt', description: 'Search query' },
    ],
  },
  {
    name: 'login',
    category: 'engagement',
    description: 'Fired when a user logs in.',
    parameters: [
      { name: 'method', type: 'string', required: false, example: 'Google', description: 'Login method' },
    ],
  },
  {
    name: 'sign_up',
    category: 'engagement',
    description: 'Fired when a user registers.',
    parameters: [
      { name: 'method', type: 'string', required: false, example: 'Email', description: 'Sign-up method' },
    ],
  },
  {
    name: 'share',
    category: 'engagement',
    description: 'Fired when a user shares content.',
    parameters: [
      { name: 'method', type: 'string', required: false, example: 'Twitter', description: 'Share platform' },
      { name: 'content_type', type: 'string', required: false, example: 'product', description: 'Content type' },
      { name: 'item_id', type: 'string', required: false, example: 'SKU_12345', description: 'Content ID' },
    ],
  },

  // ─── Game ─────────────────────────────────────────────────────
  {
    name: 'level_start',
    category: 'game',
    description: 'Fired when a player starts a game level.',
    parameters: [
      { name: 'level_name', type: 'string', required: true, example: 'Level 1 - Forest', description: 'Level name or label' },
      { name: 'level_number', type: 'number', required: true, example: 1, description: 'Level number' },
      { name: 'character', type: 'string', required: false, example: 'Warrior', description: 'Selected character class' },
    ],
  },
  {
    name: 'level_end',
    category: 'game',
    description: 'Fired when a player finishes a level (win or lose).',
    parameters: [
      { name: 'level_name', type: 'string', required: true, example: 'Level 1 - Forest', description: 'Level name' },
      { name: 'level_number', type: 'number', required: true, example: 1, description: 'Level number' },
      { name: 'success', type: 'boolean', required: true, example: true, description: 'true = completed, false = failed' },
      { name: 'score', type: 'number', required: false, example: 4200, description: 'Score at end of level' },
    ],
  },
  {
    name: 'level_up',
    category: 'game',
    description: 'Fired when a player levels up their character.',
    parameters: [
      { name: 'character', type: 'string', required: false, example: 'Warrior', description: 'Character name' },
      { name: 'level', type: 'number', required: true, example: 5, description: 'New character level' },
    ],
  },
  {
    name: 'post_score',
    category: 'game',
    description: 'Fired when a player posts or records a score.',
    parameters: [
      { name: 'score', type: 'number', required: true, example: 15000, description: 'Score value' },
      { name: 'level', type: 'number', required: false, example: 3, description: 'Level where score was achieved' },
      { name: 'character', type: 'string', required: false, example: 'Mage', description: 'Character used' },
    ],
  },
  {
    name: 'unlock_achievement',
    category: 'game',
    description: 'Fired when a player earns an achievement or badge.',
    parameters: [
      { name: 'achievement_id', type: 'string', required: true, example: 'first_win', description: 'Achievement identifier' },
      { name: 'achievement_name', type: 'string', required: false, example: 'First Victory', description: 'Achievement display name' },
    ],
  },
  {
    name: 'virtual_currency_balance',
    category: 'game',
    description: 'Fired when a player earns or spends in-game currency.',
    parameters: [
      { name: 'virtual_currency_name', type: 'string', required: true, example: 'Gems', description: 'Currency name' },
      { name: 'value', type: 'number', required: true, example: 500, description: 'Amount earned or spent (use negative for spend)' },
    ],
  },
  {
    name: 'spend_virtual_currency',
    category: 'game',
    description: 'Fired when a player spends in-game currency on an item.',
    parameters: [
      { name: 'item_name', type: 'string', required: true, example: 'Speed Boost', description: 'Item purchased' },
      { name: 'virtual_currency_name', type: 'string', required: true, example: 'Gems', description: 'Currency used' },
      { name: 'value', type: 'number', required: true, example: 150, description: 'Amount spent' },
    ],
  },
  {
    name: 'tutorial_begin',
    category: 'game',
    description: 'Fired when a player starts the tutorial.',
    parameters: [],
  },
  {
    name: 'tutorial_complete',
    category: 'game',
    description: 'Fired when a player completes the tutorial.',
    parameters: [],
  },

  // ─── Lead ─────────────────────────────────────────────────────
  {
    name: 'generate_lead',
    category: 'lead',
    description: 'Fired when a user submits a lead form.',
    parameters: [
      { name: 'currency', type: 'string', required: false, example: 'USD', description: 'Currency of estimated lead value' },
      { name: 'value', type: 'number', required: false, example: 50, description: 'Estimated lead value' },
      { name: 'lead_source', type: 'string', required: false, example: 'Contact Form', description: 'Where the lead originated' },
    ],
  },
  {
    name: 'form_submit',
    category: 'lead',
    description: 'Fired when a user submits any form (contact, demo, quote, etc.).',
    parameters: [
      { name: 'form_id', type: 'string', required: true, example: 'contact-form', description: 'Form element ID' },
      { name: 'form_name', type: 'string', required: true, example: 'Contact Form', description: 'Human-readable form name' },
      { name: 'form_destination', type: 'string', required: false, example: '/thank-you', description: 'Redirect URL after submit' },
    ],
  },
  {
    name: 'request_demo',
    category: 'lead',
    description: 'Fired when a user requests a product demo.',
    parameters: [
      { name: 'plan', type: 'string', required: false, example: 'Enterprise', description: 'Plan or tier requested' },
      { name: 'company_size', type: 'string', required: false, example: '50-200', description: 'Company size range' },
      { name: 'industry', type: 'string', required: false, example: 'SaaS', description: 'User\'s industry' },
    ],
  },
  {
    name: 'schedule_call',
    category: 'lead',
    description: 'Fired when a user books a sales or support call.',
    parameters: [
      { name: 'call_type', type: 'string', required: false, example: 'Sales', description: 'Type of call scheduled' },
      { name: 'scheduled_date', type: 'string', required: false, example: '2026-06-15', description: 'Date of scheduled call' },
    ],
  },
  {
    name: 'newsletter_signup',
    category: 'lead',
    description: 'Fired when a user subscribes to a newsletter or mailing list.',
    parameters: [
      { name: 'method', type: 'string', required: false, example: 'Footer Banner', description: 'Where the signup happened' },
      { name: 'list_name', type: 'string', required: false, example: 'Weekly Digest', description: 'Newsletter list name' },
    ],
  },
  {
    name: 'download_asset',
    category: 'lead',
    description: 'Fired when a user downloads a gated asset (whitepaper, ebook, etc.).',
    parameters: [
      { name: 'asset_name', type: 'string', required: true, example: '2026 Marketing Report', description: 'Asset title' },
      { name: 'asset_type', type: 'string', required: false, example: 'Whitepaper', description: 'Asset category' },
      { name: 'requires_email', type: 'boolean', required: false, example: true, description: 'Whether email was required to download' },
    ],
  },
  {
    name: 'chat_initiated',
    category: 'lead',
    description: 'Fired when a user opens or starts a live chat session.',
    parameters: [
      { name: 'chat_type', type: 'string', required: false, example: 'Sales', description: 'Sales, Support, or Bot' },
      { name: 'page_path', type: 'string', required: false, example: '/pricing', description: 'Page where chat was started' },
    ],
  },
  {
    name: 'cta_click',
    category: 'lead',
    description: 'Fired when a user clicks a call-to-action button.',
    parameters: [
      { name: 'cta_text', type: 'string', required: true, example: 'Get Started Free', description: 'Button label' },
      { name: 'cta_location', type: 'string', required: false, example: 'Hero Section', description: 'Where on the page' },
      { name: 'destination_url', type: 'string', required: false, example: '/signup', description: 'CTA target URL' },
    ],
  },
];

export const CUSTOM_EVENT_TEMPLATE: GA4Event = {
  name: 'custom_event',
  category: 'custom',
  description: 'Fully custom event — define your own name and parameters.',
  parameters: [],
};

import type { DocTopic } from '../../types';

export const kodeposRoute: DocTopic = {
  id: 'kodepos',
  title: 'Indonesian Postal Code',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/kodepos',
  pathTemplate: '/api/info/:slug',
  description: 'Search for Indonesian postal codes (kodepos) by postal code number or area names (province, regency, district, village).',
  parameters: [
    { name: 'query', type: 'text', required: true, desc: 'Search query (e.g. area name or postal code digits).' },
    { name: 'limit', type: 'text', required: false, desc: 'Maximum number of results to return (default: 50).' }
  ],
  payloadTemplate: {
    query: '',
    limit: '50'
  }
};

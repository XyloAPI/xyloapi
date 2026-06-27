import type { DocTopic } from '../../types';

export const yappingRoute: DocTopic = {
  id: 'yapping',
  title: 'Yapping Certificate',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/yapping',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a humorous Yapping Certificate image featuring a custom name.',
  parameters: [
    { name: 'name', type: 'text', required: true, desc: 'Recipient name to write on the certificate.' }
  ],
  payloadTemplate: {
    name: 'Ahmad Yapper Pratama'
  }
};

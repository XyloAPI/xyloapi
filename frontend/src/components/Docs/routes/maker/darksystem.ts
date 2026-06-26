import type { DocTopic } from '../../types';

export const darksystemRoute: DocTopic = {
  id: 'darksystem',
  title: 'Dark System Certificate',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/darksystem',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a mock Dark System Certificate with a custom name.',
  parameters: [
    { name: 'name', type: 'text', required: true, desc: 'Recipient name to write on the certificate.' }
  ],
  payloadTemplate: {
    name: 'Ahmad Beban Pratama'
  }
};

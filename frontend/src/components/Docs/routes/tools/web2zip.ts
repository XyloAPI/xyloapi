import type { DocTopic } from '../../types';

export const web2zipRoute: DocTopic = {
  id: 'web2zip',
  title: 'Website Cloner (Web2Zip)',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/web2zip',
  pathTemplate: '/api/tools/:slug',
  description: 'Clone and download any website into a ZIP file.',
  parameters: [
    { name: 'url', type: 'text', required: true, desc: 'Target website URL to clone.' }
  ],
  payloadTemplate: {
    url: 'https://xyloapi.qzz.io'
  }
};

import type { DocTopic } from '../../types';

export const sswebRoute: DocTopic = {
  id: 'ssweb',
  title: 'Screenshot Website (SSWeb)',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/ssweb',
  pathTemplate: '/api/tools/:slug',
  description: 'Capture screenshot of any website.',
  parameters: [
    { name: 'url', type: 'text', required: true, desc: 'Target website URL.' },
    { name: 'fullpage', type: 'select', required: false, desc: 'Capture full height of webpage.', options: ['true', 'false'] },
    { name: 'device', type: 'select', required: false, desc: 'Viewport device (desktop / mobile).', options: ['desktop', 'mobile'] }
  ],
  payloadTemplate: {
    url: 'https://xyloapi.qzz.io',
    fullpage: 'true',
    device: 'desktop'
  }
};

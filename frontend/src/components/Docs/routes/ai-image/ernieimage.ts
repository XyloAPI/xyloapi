import type { DocTopic } from '../../types';

export const ernieimageRoute: DocTopic = {
  id: 'ernieimage',
  title: 'ERNIE Image Turbo',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/ernieimage',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Ciptakan desain artistik yang memukau dan bermakna dengan ERNIE Image Turbo.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Rasio aspek gambar yang akan dibuat.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};

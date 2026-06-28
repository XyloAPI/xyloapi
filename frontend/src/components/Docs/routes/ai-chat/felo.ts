import type { DocTopic } from '../../types';

export const feloRoute: DocTopic = {
  id: 'felo',
  title: 'Felo AI',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/felo',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Berinteraksilah dengan Felo AI. Asisten pencarian berbasis AI multibahasa untuk penelitian dan percakapan umum.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};

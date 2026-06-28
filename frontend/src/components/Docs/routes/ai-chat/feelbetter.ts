import type { DocTopic } from '../../types';

export const feelbetterRoute: DocTopic = {
  id: 'feelbetter',
  title: 'FeelBetter AI',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/feelbetter',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Berinteraksilah dengan FeelBetter AI. Seorang teman percakapan yang penuh empati, dirancang untuk memberikan dukungan emosional, afirmasi positif, dan bimbingan mindfulness.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};

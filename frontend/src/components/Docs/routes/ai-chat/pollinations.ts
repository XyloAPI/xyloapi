import type { DocTopic } from '../../types';

export const pollinationsRoute: DocTopic = {
    id: 'pollinations',
    title: 'Pollinations AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/pollinations',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model AI gratis dan terbuka untuk obrolan umum dan pembuatan teks.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

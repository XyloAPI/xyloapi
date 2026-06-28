import type { DocTopic } from '../../types';

export const perplexityRoute: DocTopic = {
    id: 'perplexity',
    title: 'Perplexity AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/perplexity',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Dapatkan jawaban berbasis web real-time langsung dari Perplexity AI.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

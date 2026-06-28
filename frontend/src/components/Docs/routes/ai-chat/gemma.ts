import type { DocTopic } from '../../types';

export const gemmaRoute: DocTopic = {
  id: 'gemma',
  title: 'Google Gemma 2',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/gemma',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Berinteraksi dengan Google Gemma 2. Sebuah model yang ringan dan bersumber terbuka yang dioptimalkan untuk pertanyaan umum, mengikuti instruksi, dan penalaran.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};

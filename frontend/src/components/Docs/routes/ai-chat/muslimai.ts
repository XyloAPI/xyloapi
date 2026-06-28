import type { DocTopic } from '../../types';

export const muslimaiRoute: DocTopic = {
    id: 'muslimai',
    title: 'Muslim AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/muslimai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Dapatkan jawaban berdasarkan Al-Quran lengkap dengan referensi surah yang dikutip.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

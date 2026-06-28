import type { DocTopic } from '../../types';

export const nemotronRoute: DocTopic = {
    id: 'nemotron',
    title: 'Nemotron 3 Ultra',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/nemotron',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model besar yang dirancang untuk penalaran kompleks dan tugas-tugas analitis berat.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

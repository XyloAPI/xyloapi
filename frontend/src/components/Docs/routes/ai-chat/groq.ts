import type { DocTopic } from '../../types';

export const groqRoute: DocTopic = {
    id: 'groq',
    title: 'Groq AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/groq',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model AI canggih dengan kemampuan pencarian web real-time, eksekusi kode, dan analisis data.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the Compound AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

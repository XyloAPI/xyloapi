import type { DocTopic } from '../../types';

export const muslimaiRoute: DocTopic = {
    id: 'muslimai',
    title: 'Muslim AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/muslimai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Muslim AI. Get answers grounded in the Quran with cited surah references.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

import type { DocTopic } from '../../types';

export const ansariRoute: DocTopic = {
    id: 'ansari',
    title: 'Ansari AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/ansari',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Ansari AI. An Islamic AI assistant for questions about Islam, Quran, and daily guidance.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

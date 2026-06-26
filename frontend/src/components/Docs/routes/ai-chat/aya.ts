import type { DocTopic } from '../../types';

export const ayaRoute: DocTopic = {
    id: 'aya',
    title: 'Aya AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/aya',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Aya AI by Cohere. A powerful multilingual model for reasoning, translation, and chat.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

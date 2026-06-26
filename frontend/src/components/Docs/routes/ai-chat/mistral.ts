import type { DocTopic } from '../../types';

export const mistralRoute: DocTopic = {
    id: 'mistral',
    title: 'Mistral AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/mistral',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Mistral Medium. A powerful model for reasoning, coding, translation, and general conversation.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

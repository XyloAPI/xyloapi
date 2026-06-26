import type { DocTopic } from '../../types';

export const asyntRoute: DocTopic = {
    id: 'asynt',
    title: 'Asynt AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/asynt',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Asynt AI. A conversational AI assistant for general questions and information.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

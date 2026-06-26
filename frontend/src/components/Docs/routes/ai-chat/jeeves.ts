import type { DocTopic } from '../../types';

export const jeevesRoute: DocTopic = {
    id: 'jeeves',
    title: 'Jeeves AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/jeeves',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Jeeves AI. A fast and conversational AI assistant for general questions and tasks.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

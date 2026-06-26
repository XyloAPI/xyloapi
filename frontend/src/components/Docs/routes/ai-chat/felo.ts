import type { DocTopic } from '../../types';

export const feloRoute: DocTopic = {
    id: 'felo',
    title: 'Felo AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/felo',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Felo AI. A multilingual AI search assistant for research and general conversation.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

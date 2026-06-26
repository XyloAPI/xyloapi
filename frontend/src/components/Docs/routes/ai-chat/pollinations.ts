import type { DocTopic } from '../../types';

export const pollinationsRoute: DocTopic = {
    id: 'pollinations',
    title: 'Pollinations AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/pollinations',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Pollinations AI. A free and open AI model for general chat and text generation.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

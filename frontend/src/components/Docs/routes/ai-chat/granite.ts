import type { DocTopic } from '../../types';

export const graniteRoute: DocTopic = {
    id: 'granite',
    title: 'Granite 4.0',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/granite',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with IBM Granite 4.0. A fast and efficient model for coding, reasoning, and general chat.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

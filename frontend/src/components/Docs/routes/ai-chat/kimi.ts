import type { DocTopic } from '../../types';

export const kimiRoute: DocTopic = {
    id: 'kimi',
    title: 'Kimi 2.6',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/kimi',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with the state-of-the-art Kimi-K2.6 AI model. Ask questions, translate texts, generate code, or analyze details.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

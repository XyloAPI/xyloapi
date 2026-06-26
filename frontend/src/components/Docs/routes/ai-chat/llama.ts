import type { DocTopic } from '../../types';

export const llamaRoute: DocTopic = {
    id: 'llama',
    title: 'Llama AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/llama',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with the state-of-the-art Llama AI model. Ask questions, translate texts, generate code, or analyze details.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

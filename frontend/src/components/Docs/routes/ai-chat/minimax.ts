import type { DocTopic } from '../../types';

export const minimaxRoute: DocTopic = {
    id: 'minimax',
    title: 'MiniMax M3',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/minimax',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with the multimodal MiniMax AI model. Ask questions, translate texts, generate code, or analyze details.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

import type { DocTopic } from '../../types';

export const qwenRoute: DocTopic = {
    id: 'qwen',
    title: 'Qwen AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/qwen',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with the state-of-the-art Qwen LLM. Ask questions, get help, translate, or chat informally.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

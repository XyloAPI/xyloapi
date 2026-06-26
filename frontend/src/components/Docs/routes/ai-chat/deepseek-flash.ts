import type { DocTopic } from '../../types';

export const deepseek_flashRoute: DocTopic = {
    id: 'deepseek-flash',
    title: 'DeepSeek V4 Flash',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/deepseek-flash',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with the DeepSeek V4 Flash AI model. A fast and efficient model for coding, translation, and general queries.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

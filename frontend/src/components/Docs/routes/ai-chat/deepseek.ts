import type { DocTopic } from '../../types';

export const deepseekRoute: DocTopic = {
    id: 'deepseek',
    title: 'DeepSeek V4 Pro',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/deepseek',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with the state-of-the-art DeepSeek V4 Pro AI model. Ask questions, translate texts, generate code, or analyze details.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

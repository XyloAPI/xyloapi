import type { DocTopic } from '../../types';

export const chatgptRoute: DocTopic = {
    id: 'chatgpt',
    title: 'ChatGPT',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/chatgpt',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with ChatGPT (GPT-OSS 120B). Ask questions, generate code, translate texts, or chat freely.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

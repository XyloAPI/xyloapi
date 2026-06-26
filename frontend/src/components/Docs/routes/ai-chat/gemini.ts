import type { DocTopic } from '../../types';

export const geminiRoute: DocTopic = {
    id: 'gemini',
    title: 'Google Gemini',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/gemini',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Google Gemini. Ask questions, generate content, translate texts, or chat freely.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

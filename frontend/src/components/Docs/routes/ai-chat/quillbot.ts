import type { DocTopic } from '../../types';

export const quillbotRoute: DocTopic = {
    id: 'quillbot',
    title: 'QuillBot AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/quillbot',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with QuillBot AI. Generate drafts, brainstorm ideas, and get writing assistance.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

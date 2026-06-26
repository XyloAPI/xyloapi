import type { DocTopic } from '../../types';

export const gitaaiRoute: DocTopic = {
    id: 'gitaai',
    title: 'Gita AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/gitaai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Gita AI. Get spiritual guidance and wisdom inspired by the Bhagavad Gita.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

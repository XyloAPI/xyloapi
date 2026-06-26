import type { DocTopic } from '../../types';

export const olabibaRoute: DocTopic = {
    id: 'olabiba',
    title: 'Olabiba AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/olabiba',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Olabiba AI. A friendly conversational AI companion powered by DeepSeek.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

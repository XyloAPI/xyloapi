import type { DocTopic } from '../../types';

export const sahabataiRoute: DocTopic = {
    id: 'sahabatai',
    title: 'Sahabat AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/sahabatai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Sahabat AI by Indosat Ooredoo Hutchison. A conversational AI assistant in Indonesian.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

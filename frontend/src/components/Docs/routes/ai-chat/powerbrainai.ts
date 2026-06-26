import type { DocTopic } from '../../types';

export const powerbrainaiRoute: DocTopic = {
    id: 'powerbrainai',
    title: 'PowerBrain AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/powerbrainai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with PowerBrain AI. A general-purpose AI assistant for questions, ideas, and conversations.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

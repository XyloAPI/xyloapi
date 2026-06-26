import type { DocTopic } from '../../types';

export const groqRoute: DocTopic = {
    id: 'groq',
    title: 'Groq AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/groq',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Groq\'s Compound AI model featuring advanced tools like web search, code interpreter, and website visits.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the Compound AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

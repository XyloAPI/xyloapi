import type { DocTopic } from '../../types';

export const nemotronRoute: DocTopic = {
    id: 'nemotron',
    title: 'Nemotron 3 Ultra',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/nemotron',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Nemotron 3 Ultra 550B. A massive LLM designed for complex reasoning and analytical tasks.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

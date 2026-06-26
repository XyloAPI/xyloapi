import type { DocTopic } from '../../types';

export const perplexityRoute: DocTopic = {
    id: 'perplexity',
    title: 'Perplexity AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/perplexity',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with Perplexity AI. Get real-time web-grounded answers with source citations stripped.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

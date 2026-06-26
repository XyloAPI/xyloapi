import type { DocTopic } from '../../types';

export const gemmaRoute: DocTopic = {
  id: 'gemma',
  title: 'Google Gemma 2',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/gemma',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Interact with Google Gemma 2. A lightweight and open-source model optimized for general questions, instruction following, and reasoning.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};

import type { DocTopic } from '../../types';

export const feelbetterRoute: DocTopic = {
  id: 'feelbetter',
  title: 'FeelBetter AI',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/feelbetter',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Interact with FeelBetter AI. A compassionate conversational companion designed to provide emotional support, positive affirmations, and mindful guidance.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};

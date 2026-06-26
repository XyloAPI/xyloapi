import type { DocTopic } from '../../types';

export const deepseek_r1Route: DocTopic = {
  id: 'deepseek-r1',
  title: 'DeepSeek R1',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/deepseek-r1',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Interact with DeepSeek R1 model. A highly reasoning-optimized model capable of math, coding, logic, and deep thoughts.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};

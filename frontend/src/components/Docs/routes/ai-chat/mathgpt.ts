import type { DocTopic } from '../../types';

export const mathgptRoute: DocTopic = {
    id: 'mathgpt',
    title: 'MathGPT',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/mathgpt',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with MathGPT. An AI model specialized in solving math problems and step-by-step explanations.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The math problem or question to solve.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

import type { DocTopic } from '../../types';

export const glm_5_1Route: DocTopic = {
    id: 'glm-5.1',
    title: 'GLM 5.1',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/glm',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Interact with GLM 5.1, an advanced AI model. Supports deep reasoning, coding, and translation capabilities.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'The input message or question for the AI model.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };

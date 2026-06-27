import type { DocTopic } from '../../types';

export const toSingaporeRoute: DocTopic = {
    id: 'to-singapore',
    title: 'To Singapore (Singapore Landmark)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-singapore',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Edit a person to appear standing in front of Singapore Merlion and Marina Bay Sands using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

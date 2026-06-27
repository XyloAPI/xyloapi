import type { DocTopic } from '../../types';

export const toPolisiRoute: DocTopic = {
    id: 'to-polisi',
    title: 'To Polisi (Police Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-polisi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a police officer uniform with a police station background using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

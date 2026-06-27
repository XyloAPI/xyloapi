import type { DocTopic } from '../../types';

export const toDokterRoute: DocTopic = {
    id: 'to-dokter',
    title: 'To Dokter (Doctor Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-dokter',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a white doctor lab coat with a hospital backdrop using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

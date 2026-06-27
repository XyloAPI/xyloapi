import type { DocTopic } from '../../types';

export const toHantuRoute: DocTopic = {
    id: 'to-hantu',
    title: 'To Hantu (Ghost Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-hantu',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into a scary ghost with pale skin and messy black hair using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

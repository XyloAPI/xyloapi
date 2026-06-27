import type { DocTopic } from '../../types';

export const toKriboRoute: DocTopic = {
    id: 'to-kribo',
    title: 'To Kribo (Afro Hair)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kribo',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to have a huge classic afro (kribo) hairstyle using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

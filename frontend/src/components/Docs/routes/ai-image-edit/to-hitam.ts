import type { DocTopic } from '../../types';

export const toHitamRoute: DocTopic = {
    id: 'to-hitam',
    title: 'To Hitam (Dark Skin)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-hitam',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform skin tone to look dark and tanned using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

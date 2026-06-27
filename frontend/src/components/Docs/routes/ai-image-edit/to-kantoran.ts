import type { DocTopic } from '../../types';

export const toKantoranRoute: DocTopic = {
    id: 'to-kantoran',
    title: 'To Kantoran (Office Suit)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kantoran',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a professional office suit inside a modern office using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

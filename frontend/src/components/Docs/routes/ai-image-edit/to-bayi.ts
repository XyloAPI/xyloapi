import type { DocTopic } from '../../types';

export const toBayiRoute: DocTopic = {
    id: 'to-bayi',
    title: 'To Bayi (Baby Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-bayi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to look like a cute baby or toddler using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

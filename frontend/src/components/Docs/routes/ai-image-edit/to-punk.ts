import type { DocTopic } from '../../types';

export const toPunkRoute: DocTopic = {
    id: 'to-punk',
    title: 'To Punk (Punk Rock Style)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-punk',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into a rebel punk rocker with mohawk hair and studded leather jacket using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

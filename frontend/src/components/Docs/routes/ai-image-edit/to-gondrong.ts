import type { DocTopic } from '../../types';

export const toGondrongRoute: DocTopic = {
    id: 'to-gondrong',
    title: 'To Gondrong (Long Hair)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-gondrong',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to have a cool flowy long hairstyle using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toJepangRoute: DocTopic = {
    id: 'to-jepang',
    title: 'To Jepang (Japanese Kimono)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-jepang',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a classic Japanese Kimono with a Kyoto temple and cherry blossom backdrop using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

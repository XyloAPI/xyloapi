import type { DocTopic } from '../../types';

export const toWisudaRoute: DocTopic = {
    id: 'to-wisuda',
    title: 'To Wisuda (Graduation)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-wisuda',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a graduation gown and cap holding a diploma using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

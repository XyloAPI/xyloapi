import type { DocTopic } from '../../types';

export const toKurusRoute: DocTopic = {
    id: 'to-kurus',
    title: 'To Kurus (Slim Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kurus',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to look skinny or have a slender face shape using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

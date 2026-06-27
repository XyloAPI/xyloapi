import type { DocTopic } from '../../types';

export const toTuaRoute: DocTopic = {
    id: 'to-tua',
    title: 'To Tua (Make Old)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-tua',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to look old with realistic wrinkles and grey hair using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

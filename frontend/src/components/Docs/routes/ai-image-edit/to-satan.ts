import type { DocTopic } from '../../types';

export const toSatanRoute: DocTopic = {
    id: 'to-satan',
    title: 'To Satan (Demonic Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-satan',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into a scary demon with horns and glowing yellow/red eyes using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

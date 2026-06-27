import type { DocTopic } from '../../types';

export const toKekarRoute: DocTopic = {
    id: 'to-kekar',
    title: 'To Kekar (Muscular Physique)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kekar',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into an extremely muscular bodybuilder physique inside a gym using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

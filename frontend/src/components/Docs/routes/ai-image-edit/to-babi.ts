import type { DocTopic } from '../../types';

export const toBabiRoute: DocTopic = {
    id: 'to-babi',
    title: 'To Babi (Pig Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-babi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into having a funny pig face using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

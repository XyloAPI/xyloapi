import type { DocTopic } from '../../types';

export const toPeciRoute: DocTopic = {
    id: 'to-peci',
    title: 'To Peci (Wear Songkok/Peci)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-peci',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Add a traditional black Indonesian peci / songkok cap to a person using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

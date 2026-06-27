import type { DocTopic } from '../../types';

export const toDubaiRoute: DocTopic = {
    id: 'to-dubai',
    title: 'To Dubai (Dubai Cityscape)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-dubai',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Edit a person to appear standing in front of Dubai skyscrapers like Burj Khalifa and Burj Al Arab using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

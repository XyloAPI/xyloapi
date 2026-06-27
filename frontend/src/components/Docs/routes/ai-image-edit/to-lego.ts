import type { DocTopic } from '../../types';

export const toLegoRoute: DocTopic = {
    id: 'to-lego',
    title: 'To Lego (Lego Minifigure)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-lego',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person or a scene into a LEGO minifigure style using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

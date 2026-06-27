import type { DocTopic } from '../../types';

export const toChibiRoute: DocTopic = {
    id: 'to-chibi',
    title: 'To Chibi (Chibi Character)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-chibi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into a cute 3D chibi-style character using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toVampirRoute: DocTopic = {
    id: 'to-vampir',
    title: 'To Vampir (Vampire Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-vampir',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into a vampire with red eyes and gothic clothes using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

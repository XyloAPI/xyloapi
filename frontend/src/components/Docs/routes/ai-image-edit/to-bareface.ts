import type { DocTopic } from '../../types';

export const toBarefaceRoute: DocTopic = {
    id: 'to-bareface',
    title: 'To Bareface (No Makeup)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-bareface',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to have a completely natural bare face skin with no makeup or filters using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

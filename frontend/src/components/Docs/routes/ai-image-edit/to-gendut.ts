import type { DocTopic } from '../../types';

export const toGendutRoute: DocTopic = {
    id: 'to-gendut',
    title: 'To Gendut (Chubby Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-gendut',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to look overweight or have a cute chubby face using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toBlondeRoute: DocTopic = {
    id: 'to-blonde',
    title: 'To Blonde (Make Blonde Hair)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-blonde',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform hair into blonde using advanced AI image editing. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

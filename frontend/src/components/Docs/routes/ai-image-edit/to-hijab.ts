import type { DocTopic } from '../../types';

export const toHijabRoute: DocTopic = {
    id: 'to-hijab',
    title: 'To Hijab (Wear Hijab)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-hijab',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Add a beautiful hijab headscarf to a person using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

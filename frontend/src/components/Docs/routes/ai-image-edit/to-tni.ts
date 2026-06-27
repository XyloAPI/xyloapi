import type { DocTopic } from '../../types';

export const toTniRoute: DocTopic = {
    id: 'to-tni',
    title: 'To TNI (Military Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-tni',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a TNI military army camouflage uniform on a training field using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

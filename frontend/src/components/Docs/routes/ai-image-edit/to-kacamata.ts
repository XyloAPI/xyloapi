import type { DocTopic } from '../../types';

export const toKacamataRoute: DocTopic = {
    id: 'to-kacamata',
    title: 'To Kacamata (Wear Glasses)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kacamata',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Add stylish modern eyeglasses to a person using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

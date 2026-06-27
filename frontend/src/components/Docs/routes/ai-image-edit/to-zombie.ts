import type { DocTopic } from '../../types';

export const toZombieRoute: DocTopic = {
    id: 'to-zombie',
    title: 'To Zombie (Decayed Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-zombie',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into a scary zombie using advanced AI editing. Upload an image file or direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toMekkahRoute: DocTopic = {
    id: 'to-mekkah',
    title: 'To Mekkah (Kaaba Backdrop)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-mekkah',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Edit a person to appear standing in front of the Kaaba in Mekkah using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

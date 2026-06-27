import type { DocTopic } from '../../types';

export const toMalaysiaRoute: DocTopic = {
    id: 'to-malaysia',
    title: 'To Malaysia (Petronas Towers Backdrop)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-malaysia',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Edit a person to appear standing in front of the Petronas Twin Towers in Kuala Lumpur using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

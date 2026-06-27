import type { DocTopic } from '../../types';

export const toThailandRoute: DocTopic = {
    id: 'to-thailand',
    title: 'To Thailand (Thailand Temple Backdrop)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-thailand',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Edit a person to appear standing in front of a traditional temple in Thailand using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

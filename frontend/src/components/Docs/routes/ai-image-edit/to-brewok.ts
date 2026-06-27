import type { DocTopic } from '../../types';

export const toBrewokRoute: DocTopic = {
    id: 'to-brewok',
    title: 'To Brewok (Thick Beard)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-brewok',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Add a realistic thick beard and mustache to a person using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toSdmTinggiRoute: DocTopic = {
    id: 'to-sdm-tinggi',
    title: 'To SDM Tinggi (Nerdy Smart)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-sdm-tinggi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to look like a nerdy, clean-cut, smart intellectual using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toVintageRoute: DocTopic = {
    id: 'to-vintage',
    title: 'To Vintage (Vintage Polaroid)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-vintage',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform an image to look like a retro 1980s polaroid photo with faded colors and warm grain using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

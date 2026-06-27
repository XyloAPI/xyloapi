import type { DocTopic } from '../../types';

export const toAnimeRoute: DocTopic = {
    id: 'to-anime',
    title: 'To Anime (Anime Style)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-anime',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person into an anime-style illustration using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

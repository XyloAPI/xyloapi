import type { DocTopic } from '../../types';

export const toKoreaRoute: DocTopic = {
    id: 'to-korea',
    title: 'To Korea (Korean Hanbok)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-korea',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear traditional Korean Hanbok with a Gyeongbokgung Palace and cherry blossom backdrop using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

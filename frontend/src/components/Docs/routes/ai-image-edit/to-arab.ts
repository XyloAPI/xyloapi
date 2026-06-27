import type { DocTopic } from '../../types';

export const toArabRoute: DocTopic = {
    id: 'to-arab',
    title: 'To Arab (Arabic Attire)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-arab',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear traditional Arabic clothing (abaya/hijab for women, thobe/shemagh for men) using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

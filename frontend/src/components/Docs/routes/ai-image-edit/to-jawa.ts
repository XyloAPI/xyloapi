import type { DocTopic } from '../../types';

export const toJawaRoute: DocTopic = {
    id: 'to-jawa',
    title: 'To Jawa (Javanese Outfit)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-jawa',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear traditional Javanese outfit (kebaya for women, beskap with blangkon for men) using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

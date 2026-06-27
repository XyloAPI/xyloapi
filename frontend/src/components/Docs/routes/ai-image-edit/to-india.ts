import type { DocTopic } from '../../types';

export const toIndiaRoute: DocTopic = {
    id: 'to-india',
    title: 'To India (Indian Sari)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-india',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear traditional Indian clothing (sari for women, sherwani for men) with a Taj Mahal backdrop using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

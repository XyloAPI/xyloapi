import type { DocTopic } from '../../types';

export const toDprRoute: DocTopic = {
    id: 'to-dpr',
    title: 'To DPR (Parliament Member)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-dpr',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to look like a DPR RI parliament member sitting in the parliament chair using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

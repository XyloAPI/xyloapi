import type { DocTopic } from '../../types';

export const toPilotRoute: DocTopic = {
    id: 'to-pilot',
    title: 'To Pilot (Pilot Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-pilot',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform a person to wear a pilot uniform inside an airplane cockpit using advanced AI. Upload an image file or provide a direct image URL.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

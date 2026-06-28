import type { DocTopic } from '../../types';

export const toPilotRoute: DocTopic = {
    id: 'to-pilot',
    title: 'To Pilot (Pilot Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-pilot',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan seragam pilot di dalam kokpit pesawat.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

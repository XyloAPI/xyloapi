import type { DocTopic } from '../../types';

export const toSingaporeRoute: DocTopic = {
    id: 'to-singapore',
    title: 'To Singapore (Singapore Landmark)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-singapore',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah latar belakang foto menjadi Merlion dan Marina Bay Sands Singapura.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

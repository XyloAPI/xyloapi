import type { DocTopic } from '../../types';

export const toKekarRoute: DocTopic = {
    id: 'to-kekar',
    title: 'To Kekar (Muscular Physique)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kekar',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah postur tubuh menjadi sangat kekar dan berotot di dalam gym.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

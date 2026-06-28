import type { DocTopic } from '../../types';

export const toDprRoute: DocTopic = {
    id: 'to-dpr',
    title: 'To DPR (Parliament Member)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-dpr',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto menjadi anggota DPR RI yang sedang duduk di kursi parlemen.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

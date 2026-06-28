import type { DocTopic } from '../../types';

export const toKantoranRoute: DocTopic = {
    id: 'to-kantoran',
    title: 'To Kantoran (Office Suit)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kantoran',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan pakaian kerja profesional dengan latar kantor modern.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

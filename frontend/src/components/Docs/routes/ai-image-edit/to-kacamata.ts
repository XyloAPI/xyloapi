import type { DocTopic } from '../../types';

export const toKacamataRoute: DocTopic = {
    id: 'to-kacamata',
    title: 'To Kacamata (Wear Glasses)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kacamata',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Tambahkan kacamata modern dan bergaya pada wajah.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

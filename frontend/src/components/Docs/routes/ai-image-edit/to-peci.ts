import type { DocTopic } from '../../types';

export const toPeciRoute: DocTopic = {
    id: 'to-peci',
    title: 'To Peci (Wear Songkok/Peci)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-peci',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Tambahkan peci / songkok hitam tradisional Indonesia.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

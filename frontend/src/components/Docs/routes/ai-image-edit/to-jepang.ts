import type { DocTopic } from '../../types';

export const toJepangRoute: DocTopic = {
    id: 'to-jepang',
    title: 'To Jepang (Japanese Kimono)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-jepang',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan Kimono Jepang dengan latar belakang kuil dan bunga sakura.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

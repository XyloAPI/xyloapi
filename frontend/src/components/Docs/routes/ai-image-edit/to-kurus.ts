import type { DocTopic } from '../../types';

export const toKurusRoute: DocTopic = {
    id: 'to-kurus',
    title: 'To Kurus (Slim Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kurus',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi terlihat lebih tirus atau kurus.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

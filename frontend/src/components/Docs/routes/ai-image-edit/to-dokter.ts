import type { DocTopic } from '../../types';

export const toDokterRoute: DocTopic = {
    id: 'to-dokter',
    title: 'To Dokter (Doctor Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-dokter',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan jas dokter putih dengan latar belakang rumah sakit.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

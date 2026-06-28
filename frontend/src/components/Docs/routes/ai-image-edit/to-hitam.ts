import type { DocTopic } from '../../types';

export const toHitamRoute: DocTopic = {
    id: 'to-hitam',
    title: 'To Hitam (Dark Skin)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-hitam',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah warna kulit menjadi gelap dan eksotis.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

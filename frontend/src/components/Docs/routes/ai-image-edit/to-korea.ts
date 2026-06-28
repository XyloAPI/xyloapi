import type { DocTopic } from '../../types';

export const toKoreaRoute: DocTopic = {
    id: 'to-korea',
    title: 'To Korea (Korean Hanbok)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-korea',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan Hanbok tradisional Korea dengan latar Istana Gyeongbokgung.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

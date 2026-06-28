import type { DocTopic } from '../../types';

export const toPutihRoute: DocTopic = {
    id: 'to-putih',
    title: 'To Putih (Fair skin)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-putih',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah warna kulit menjadi sangat cerah, putih, dan bersinar.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

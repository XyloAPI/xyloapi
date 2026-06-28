import type { DocTopic } from '../../types';

export const toPunkRoute: DocTopic = {
    id: 'to-punk',
    title: 'To Punk (Punk Rock Style)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-punk',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto menjadi anak punk rock dengan rambut mohawk dan jaket kulit.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

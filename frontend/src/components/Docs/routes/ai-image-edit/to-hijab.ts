import type { DocTopic } from '../../types';

export const toHijabRoute: DocTopic = {
    id: 'to-hijab',
    title: 'To Hijab (Wear Hijab)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-hijab',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Tambahkan hijab yang cantik pada foto wanita.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

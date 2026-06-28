import type { DocTopic } from '../../types';

export const toBabiRoute: DocTopic = {
    id: 'to-babi',
    title: 'To Babi (Pig Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-babi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi memiliki hidung/wajah babi yang lucu.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

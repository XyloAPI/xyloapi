import type { DocTopic } from '../../types';

export const toJawaRoute: DocTopic = {
    id: 'to-jawa',
    title: 'To Jawa (Javanese Outfit)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-jawa',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan pakaian adat Jawa (kebaya/beskap & blangkon).',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

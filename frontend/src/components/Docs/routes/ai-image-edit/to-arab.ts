import type { DocTopic } from '../../types';

export const toArabRoute: DocTopic = {
    id: 'to-arab',
    title: 'To Arab (Arabic Attire)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-arab',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto wajah mengenakan pakaian tradisional Arab (abaya/hijab atau thobe/sorban).',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

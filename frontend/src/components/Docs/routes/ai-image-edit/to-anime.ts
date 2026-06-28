import type { DocTopic } from '../../types';

export const toAnimeRoute: DocTopic = {
    id: 'to-anime',
    title: 'To Anime (Anime Style)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-anime',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto wajah menjadi gaya ilustrasi anime.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

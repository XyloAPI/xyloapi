import type { DocTopic } from '../../types';

export const toLegoRoute: DocTopic = {
    id: 'to-lego',
    title: 'To Lego (Lego Minifigure)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-lego',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto orang atau pemandangan menjadi gaya karakter mainan LEGO.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

import type { DocTopic } from '../../types';

export const toVampirRoute: DocTopic = {
    id: 'to-vampir',
    title: 'To Vampir (Vampire Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-vampir',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi vampir dengan mata merah dan pakaian gothic.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

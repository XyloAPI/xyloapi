import type { DocTopic } from '../../types';

export const toPolisiRoute: DocTopic = {
    id: 'to-polisi',
    title: 'To Polisi (Police Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-polisi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan seragam polisi dengan latar belakang kantor polisi.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

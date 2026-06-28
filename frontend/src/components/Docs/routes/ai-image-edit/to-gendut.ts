import type { DocTopic } from '../../types';

export const toGendutRoute: DocTopic = {
    id: 'to-gendut',
    title: 'To Gendut (Chubby Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-gendut',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi terlihat gemuk atau chubby.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

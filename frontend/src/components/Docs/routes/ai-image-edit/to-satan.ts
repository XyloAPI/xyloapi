import type { DocTopic } from '../../types';

export const toSatanRoute: DocTopic = {
    id: 'to-satan',
    title: 'To Satan (Demonic Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-satan',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi iblis menyeramkan dengan tanduk dan mata menyala.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

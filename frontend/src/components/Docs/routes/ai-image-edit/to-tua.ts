import type { DocTopic } from '../../types';

export const toTuaRoute: DocTopic = {
    id: 'to-tua',
    title: 'To Tua (Make Old)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-tua',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi terlihat tua dengan kerutan dan rambut beruban yang realistis.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

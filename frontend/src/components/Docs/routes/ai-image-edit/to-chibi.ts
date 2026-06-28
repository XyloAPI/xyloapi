import type { DocTopic } from '../../types';

export const toChibiRoute: DocTopic = {
    id: 'to-chibi',
    title: 'To Chibi (Chibi Character)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-chibi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto menjadi karakter bergaya chibi 3D yang imut.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

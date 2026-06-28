import type { DocTopic } from '../../types';

export const toMekkahRoute: DocTopic = {
    id: 'to-mekkah',
    title: 'To Mekkah (Kaaba Backdrop)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-mekkah',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah latar belakang foto menjadi Kabah di Mekkah.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

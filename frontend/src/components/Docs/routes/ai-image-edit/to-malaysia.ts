import type { DocTopic } from '../../types';

export const toMalaysiaRoute: DocTopic = {
    id: 'to-malaysia',
    title: 'To Malaysia (Petronas Towers Backdrop)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-malaysia',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah latar belakang foto menjadi Menara Kembar Petronas di Kuala Lumpur.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

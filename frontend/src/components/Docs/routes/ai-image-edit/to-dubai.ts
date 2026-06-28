import type { DocTopic } from '../../types';

export const toDubaiRoute: DocTopic = {
    id: 'to-dubai',
    title: 'To Dubai (Dubai Cityscape)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-dubai',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah latar belakang foto menjadi gedung pencakar langit Dubai (Burj Khalifa, dll).',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

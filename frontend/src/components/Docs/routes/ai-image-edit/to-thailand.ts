import type { DocTopic } from '../../types';

export const toThailandRoute: DocTopic = {
    id: 'to-thailand',
    title: 'To Thailand (Thailand Temple Backdrop)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-thailand',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah latar belakang foto menjadi kuil tradisional di Thailand.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

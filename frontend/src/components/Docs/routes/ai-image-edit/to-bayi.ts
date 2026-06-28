import type { DocTopic } from '../../types';

export const toBayiRoute: DocTopic = {
    id: 'to-bayi',
    title: 'To Bayi (Baby Face)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-bayi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi terlihat seperti bayi atau balita yang lucu.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

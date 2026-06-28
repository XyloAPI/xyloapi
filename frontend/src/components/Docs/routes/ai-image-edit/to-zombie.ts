import type { DocTopic } from '../../types';

export const toZombieRoute: DocTopic = {
    id: 'to-zombie',
    title: 'To Zombie (Decayed Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-zombie',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi zombie yang menyeramkan.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

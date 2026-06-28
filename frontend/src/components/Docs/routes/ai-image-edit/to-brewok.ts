import type { DocTopic } from '../../types';

export const toBrewokRoute: DocTopic = {
    id: 'to-brewok',
    title: 'To Brewok (Thick Beard)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-brewok',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Tambahkan brewok dan kumis tebal yang realistis pada wajah.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

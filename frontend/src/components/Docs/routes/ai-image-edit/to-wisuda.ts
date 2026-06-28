import type { DocTopic } from '../../types';

export const toWisudaRoute: DocTopic = {
    id: 'to-wisuda',
    title: 'To Wisuda (Graduation)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-wisuda',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan toga wisuda sambil memegang ijazah.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

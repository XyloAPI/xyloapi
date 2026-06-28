import type { DocTopic } from '../../types';

export const toCyberpunkRoute: DocTopic = {
    id: 'to-cyberpunk',
    title: 'To Cyberpunk (Cyborg Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-cyberpunk',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto menjadi gaya cyborg cyberpunk futuristik dengan aksen neon.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

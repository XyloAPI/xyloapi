import type { DocTopic } from '../../types';

export const toVintageRoute: DocTopic = {
    id: 'to-vintage',
    title: 'To Vintage (Vintage Polaroid)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-vintage',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah gaya foto menjadi bergaya retro polaroid 1980-an dengan warna pudar.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

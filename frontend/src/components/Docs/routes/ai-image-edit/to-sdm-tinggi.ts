import type { DocTopic } from '../../types';

export const toSdmTinggiRoute: DocTopic = {
    id: 'to-sdm-tinggi',
    title: 'To SDM Tinggi (Nerdy Smart)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-sdm-tinggi',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto menjadi terlihat seperti orang pintar, kutu buku, atau intelektual tinggi.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

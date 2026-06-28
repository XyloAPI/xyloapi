import type { DocTopic } from '../../types';

export const toIndiaRoute: DocTopic = {
    id: 'to-india',
    title: 'To India (Indian Sari)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-india',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan pakaian tradisional India dengan latar belakang Taj Mahal.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};

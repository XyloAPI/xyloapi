import type { DocTopic } from '../../types';

export const yourimageshareRoute: DocTopic = {
    id: 'yourimageshare',
    title: 'YourImageShare Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/yourimageshare',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke platform YourImageShare.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

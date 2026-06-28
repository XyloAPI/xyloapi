import type { DocTopic } from '../../types';

export const n_8uploadsRoute: DocTopic = {
    id: '8uploads',
    title: '8uploads Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/8uploads',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke platform hosting 8upload.com.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

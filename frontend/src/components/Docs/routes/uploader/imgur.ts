import type { DocTopic } from '../../types';

export const imgurRoute: DocTopic = {
    id: 'imgur',
    title: 'Imgur Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imgur',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke CDN Imgur.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

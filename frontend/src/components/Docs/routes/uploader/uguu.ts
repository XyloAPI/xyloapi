import type { DocTopic } from '../../types';

export const uguuRoute: DocTopic = {
    id: 'uguu',
    title: 'Uguu Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/uguu',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file sementara hingga 100MB langsung ke platform Uguu.se (kedaluwarsa dalam 24 jam).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

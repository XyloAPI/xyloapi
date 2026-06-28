import type { DocTopic } from '../../types';

export const litterboxRoute: DocTopic = {
    id: 'litterbox',
    title: 'Litterbox Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/litterbox',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file sementara hingga 1GB langsung ke platform Litterbox.catbox.moe (kedaluwarsa dalam 24 jam).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

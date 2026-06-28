import type { DocTopic } from '../../types';

export const catboxRoute: DocTopic = {
    id: 'catbox',
    title: 'Catbox Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/catbox',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke platform hosting Catbox.moe.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

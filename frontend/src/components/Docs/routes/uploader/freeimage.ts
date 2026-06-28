import type { DocTopic } from '../../types';

export const freeimageRoute: DocTopic = {
    id: 'freeimage',
    title: 'FreeImage Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/freeimage',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke platform hosting FreeImage.host.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

import type { DocTopic } from '../../types';

export const imghippoRoute: DocTopic = {
    id: 'imghippo',
    title: 'ImgHippo Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imghippo',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke platform hosting ImgHippo.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

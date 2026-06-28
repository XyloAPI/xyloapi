import type { DocTopic } from '../../types';

export const imgbbRoute: DocTopic = {
    id: 'imgbb',
    title: 'ImgBB Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imgbb',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file gambar lokal atau URL jarak jauh langsung ke platform hosting ImgBB.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file gambar lokal untuk diunggah atau masukkan URL gambar' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

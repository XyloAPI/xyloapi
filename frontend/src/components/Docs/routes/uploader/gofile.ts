import type { DocTopic } from '../../types';

export const gofileRoute: DocTopic = {
    id: 'gofile',
    title: 'GoFile Uploader',
    category: 'File Uploaders',
    method: 'POST',
    path: '/api/uploader/gofile',
    pathTemplate: '/api/uploader/:slug',
    description: 'Unggah file lokal, gambar, video, atau dokumen apa pun langsung ke platform berbagi file GoFile.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Pilih file lokal untuk diunggah atau masukkan URL file' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

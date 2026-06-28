import type { DocTopic } from '../../types';

export const solarizeRoute: DocTopic = {
    id: 'solarize',
    title: 'Solarize Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/solarize',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Balikkan warna gambar di atas ambang batas kecerahan tertentu untuk menciptakan efek surealis (solarize).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'threshold', type: 'number', required: false, desc: 'Ambang batas kecerahan dari 0 hingga 255. Default adalah 128.' }
    ],
    payloadTemplate: {
      image: '',
      threshold: 128
    }
  };

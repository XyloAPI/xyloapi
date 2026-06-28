import type { DocTopic } from '../../types';

export const blurRoute: DocTopic = {
  id: 'blur',
  title: 'Blur Image',
  category: 'Image Tools',
  method: 'POST',
  description: 'Terapkan efek buram (blur) Gaussian pada gambar dengan radius intensitas yang dapat disesuaikan.',
  parameters: [
    { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
    { name: 'radius', type: 'number', required: false, desc: 'Radius buram dari 1 hingga 50. Default adalah 10.' }
  ],
  payloadTemplate: {
    image: '',
    radius: 10
  }
};

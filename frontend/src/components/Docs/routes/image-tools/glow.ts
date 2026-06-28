import type { DocTopic } from '../../types';

export const glowRoute: DocTopic = {
    id: 'glow',
    title: 'Glow Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/glow',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Tambahkan efek bercahaya (glow) warna-warni di sekitar elemen transparan pada gambar PNG.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'intensity', type: 'number', required: false, desc: 'Intensitas cahaya dari 1 hingga 100. Default adalah 20.' },
      { name: 'radius', type: 'number', required: false, desc: 'Radius blur cahaya dari 1 hingga 50. Default adalah 10.' },
      { name: 'color', type: 'color', required: false, desc: "Kode warna Hex untuk efek cahaya (contoh: '#ffffff' atau '#ff00bb'). Default adalah '#ffffff'." }
    ],
    payloadTemplate: {
      image: '',
      intensity: 20,
      radius: 10,
      color: '#ffffff'
    }
  };

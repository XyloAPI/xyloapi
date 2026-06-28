import type { DocTopic } from '../../types';

export const shioRoute: DocTopic = {
  id: 'shio',
  title: 'Shio',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/shio',
  pathTemplate: '/api/primbon/:slug',
  description: 'Membaca ramalan watak, nasib, dan karakteristik berdasarkan Shio lahir.',
  parameters: [
    {
      name: 'shio',
      type: 'select',
      required: true,
      desc: 'Pilih Shio Anda.',
      options: [
        { value: 'tikus', label: 'Tikus' },
        { value: 'kerbau', label: 'Kerbau' },
        { value: 'macan', label: 'Macan' },
        { value: 'kelinci', label: 'Kelinci' },
        { value: 'naga', label: 'Naga' },
        { value: 'ular', label: 'Ular' },
        { value: 'kuda', label: 'Kuda' },
        { value: 'kambing', label: 'Kambing' },
        { value: 'monyet', label: 'Monyet' },
        { value: 'ayam', label: 'Ayam' },
        { value: 'anjing', label: 'Anjing' },
        { value: 'babi', label: 'Babi' }
      ]
    }
  ],
  payloadTemplate: {
    shio: 'tikus'
  }
};

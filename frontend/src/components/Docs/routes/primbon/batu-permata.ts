import type { DocTopic } from '../../types';

export const batuPermataRoute: DocTopic = {
  id: 'batu-permata',
  title: 'Batu Permata',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/batu-permata',
  pathTemplate: '/api/primbon/:slug',
  description: 'Mendapatkan khasiat dan manfaat spiritual/fisik dari batu permata pilihan berdasarkan Primbon Jawa.',
  parameters: [
    {
      name: 'batu',
      type: 'select',
      required: true,
      desc: 'Pilih jenis batu permata.',
      options: [
        { value: '1', label: 'Akik Lumut' },
        { value: '2', label: 'Akik Pohon' },
        { value: '3', label: 'Akik Garis/Pita' },
        { value: '4', label: 'Akik Renda/Jalinan' },
        { value: '5', label: 'Akik Menyerupai Bulu Burung' },
        { value: '6', label: 'Akik Bintik-bintik' },
        { value: '7', label: 'Akik Mata' },
        { value: '8', label: 'Akik Dendrite' },
        { value: '9', label: 'Akik India' },
        { value: '10', label: 'Akik Botswana' },
        { value: '11', label: 'Jasper Kulit Leopard' },
        { value: '12', label: 'Poppy Jasper' },
        { value: '13', label: 'Opalite Jasper' },
        { value: '14', label: 'Jasper Coklat' },
        { value: '15', label: 'Jasper Hijau' },
        { value: '16', label: 'Jasper Merah' },
        { value: '17', label: 'Druzy Quartz' },
        { value: '18', label: 'Rutilated Quartz' },
        { value: '19', label: 'Smokey Quartz/Kwarsa Coklat' },
        { value: '20', label: 'White Quartz/Kwarsa Putih' }
      ]
    }
  ],
  payloadTemplate: {
    batu: '1'
  }
};

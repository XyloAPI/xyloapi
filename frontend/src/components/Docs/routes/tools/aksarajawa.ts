import type { DocTopic } from '../../types';

export const aksarajawaRoute: DocTopic = {
  id: 'aksara-jawa',
  title: 'Aksara Jawa Transliterator',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/aksara-jawa',
  pathTemplate: '/api/tools/:slug',
  description: 'Transliterate text between Latin and Aksara Jawa (Javanese Script).',
  parameters: [
    { name: 'text', type: 'text', required: true, desc: 'Text to transliterate.' },
    {
      name: 'direction',
      type: 'select',
      required: false,
      desc: 'Transliteration direction.',
      options: [
        { value: 'latin2jawa', label: 'Latin -> Aksara Jawa' },
        { value: 'jawa2latin', label: 'Aksara Jawa -> Latin' }
      ]
    },
    {
      name: 'mode',
      type: 'select',
      required: false,
      desc: 'Input mode for pepet/taling mapping.',
      options: [
        { value: 'ketik', label: 'Ketik (x for pepet, e for taling)' },
        { value: 'kopas', label: 'Kopas (e for pepet)' }
      ]
    },
    {
      name: 'murda',
      type: 'select',
      required: false,
      desc: 'Use Aksara Murda.',
      options: [
        { value: 'tidak', label: 'Tidak Pakai Murda' },
        { value: 'pakai', label: 'Pakai Murda' }
      ]
    },
    {
      name: 'diftong',
      type: 'select',
      required: false,
      desc: 'Use Diphthongs (e.g. ai, au).',
      options: [
        { value: 'tidak', label: 'Tidak Pakai Diftong' },
        { value: 'pakai', label: 'Pakai Diftong' }
      ]
    },
    {
      name: 'spasi',
      type: 'select',
      required: false,
      desc: 'Space handling behavior.',
      options: [
        { value: 'without', label: 'Without Space (Tanpa Spasi)' },
        { value: 'with', label: 'With Space (Pakai Spasi)' }
      ]
    }
  ],
  payloadTemplate: {
    text: 'nulisa aksara jawa',
    direction: 'latin2jawa',
    mode: 'ketik',
    murda: 'tidak',
    diftong: 'tidak',
    spasi: 'without'
  }
};

import type { DocTopic } from '../../types';

export const zodiakRoute: DocTopic = {
  id: 'zodiak',
  title: 'Zodiak',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/zodiak',
  pathTemplate: '/api/primbon/:slug',
  description: 'Membaca ramalan nasib, karakter, keberuntungan, dan asmara berdasarkan Zodiak.',
  parameters: [
    {
      name: 'zodiak',
      type: 'select',
      required: true,
      desc: 'Pilih zodiak Anda.',
      options: [
        { value: 'capricorn', label: 'Capricorn' },
        { value: 'aquarius', label: 'Aquarius' },
        { value: 'pisces', label: 'Pisces' },
        { value: 'aries', label: 'Aries' },
        { value: 'taurus', label: 'Taurus' },
        { value: 'gemini', label: 'Gemini' },
        { value: 'cancer', label: 'Cancer' },
        { value: 'leo', label: 'Leo' },
        { value: 'virgo', label: 'Virgo' },
        { value: 'libra', label: 'Libra' },
        { value: 'scorpio', label: 'Scorpio' },
        { value: 'sagitarius', label: 'Sagitarius' }
      ]
    }
  ],
  payloadTemplate: {
    zodiak: 'capricorn'
  }
};

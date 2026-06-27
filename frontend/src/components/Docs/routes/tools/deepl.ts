import type { DocTopic } from '../../types';

const deeplLanguages = [
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'Inggris (English)' },
  { value: 'ja', label: 'Jepang' },
  { value: 'ko', label: 'Korea' },
  { value: 'zh', label: 'Tiongkok (Chinese)' },
  { value: 'ar', label: 'Arab' },
  { value: 'fr', label: 'Prancis' },
  { value: 'de', label: 'Jerman' },
  { value: 'es', label: 'Spanyol' },
  { value: 'ru', label: 'Rusia' },
  { value: 'it', label: 'Italia' },
  { value: 'pt', label: 'Portugal / Brasil' },
  { value: 'nl', label: 'Belanda' },
  { value: 'tr', label: 'Turki' },
  { value: 'vi', label: 'Vietnam' },
  { value: 'sv', label: 'Swedia' },
  { value: 'da', label: 'Denmark' },
  { value: 'fi', label: 'Finlandia' },
  { value: 'pl', label: 'Polandia' },
  { value: 'uk', label: 'Ukraina' },
  { value: 'bg', label: 'Bulgaria' },
  { value: 'cs', label: 'Ceko' },
  { value: 'el', label: 'Yunani' },
  { value: 'et', label: 'Estonia' },
  { value: 'hu', label: 'Hongaria' },
  { value: 'lt', label: 'Lituania' },
  { value: 'lv', label: 'Latvia' },
  { value: 'ro', label: 'Rumania' },
  { value: 'sk', label: 'Slowakia' },
  { value: 'sl', label: 'Slowenia' }
];

const sourceLanguages = [
  { value: 'auto', label: 'Deteksi Otomatis (Auto Detect)' },
  ...deeplLanguages
];

export const deeplRoute: DocTopic = {
  id: 'deepl',
  title: 'DeepL Translate',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/deepl',
  pathTemplate: '/api/tools/:slug',
  description: 'Translate text using DeepL Translation service.',
  parameters: [
    { name: 'text', type: 'text', required: true, desc: 'Text to translate.' },
    { name: 'to', type: 'select', required: false, desc: 'Target language.', options: deeplLanguages },
    { name: 'from', type: 'select', required: false, desc: 'Source language.', options: sourceLanguages }
  ],
  payloadTemplate: {
    text: 'hello world',
    to: 'id',
    from: 'auto'
  }
};

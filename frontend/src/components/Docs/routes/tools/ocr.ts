import type { DocTopic } from '../../types';

export const ocrRoute: DocTopic = {
  id: 'ocr',
  title: 'OCR Image Reader (OCR)',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/ocr',
  pathTemplate: '/api/tools/:slug',
  description: 'Extract readable text and lines from any image.',
  parameters: [
    { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to extract text from.' },
    { name: 'language', type: 'select', required: false, desc: 'OCR parsing language.', options: ['eng', 'chs', 'cht', 'ger', 'fre', 'ara', 'kor', 'jpn', 'spa'] }
  ],
  payloadTemplate: {
    image: '',
    language: 'eng'
  }
};

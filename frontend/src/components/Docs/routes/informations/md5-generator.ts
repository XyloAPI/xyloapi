import type { DocTopic } from '../../types';

export const md5GeneratorRoute: DocTopic = {
  id: 'md5-generator',
  title: 'MD5 & Hash Generator',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/md5-generator',
  pathTemplate: '/api/info/:slug',
  description: 'Hasilkan nilai enkripsi MD5, SHA-1, dan Base64 untuk input string apa pun.',
  parameters: [
    { name: 'str', type: 'text', required: true, desc: 'Input string untuk di-hash.' }
  ],
  payloadTemplate: {
    str: 'test'
  }
};

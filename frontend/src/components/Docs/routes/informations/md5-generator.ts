import type { DocTopic } from '../../types';

export const md5GeneratorRoute: DocTopic = {
  id: 'md5-generator',
  title: 'MD5 & Hash Generator',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/md5-generator',
  pathTemplate: '/api/info/:slug',
  description: 'Generate MD5, SHA-1, and Base64 encoded values for any input string.',
  parameters: [
    { name: 'str', type: 'text', required: true, desc: 'The input string to hash.' }
  ],
  payloadTemplate: {
    str: 'test'
  }
};

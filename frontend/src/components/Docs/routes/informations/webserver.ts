import type { DocTopic } from '../../types';

export const webserverRoute: DocTopic = {
  id: 'webserver',
  title: 'HTTP Response Headers',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/webserver',
  pathTemplate: '/api/info/:slug',
  description: 'Periksa header respons HTTP, hop pengalihan (redirect), detail server, cookie, dan kebijakan cache untuk suatu domain atau URL.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain atau URL yang akan dicek (contoh: google.com atau https://xyloapi.qzz.io).' },
    { name: 'advOptions', type: 'select', required: false, desc: 'Metode permintaan HTTP yang digunakan (default: get).', options: ['get', 'head'] },
    { name: 'acceptCompressedContent', type: 'boolean', required: false, desc: 'Terima encoding konten yang dikompresi (gzip, deflate, br) (default: true).' },
    { name: 'followRedirects', type: 'boolean', required: false, desc: 'Ikuti lokasi pengalihan (redirect) HTTP 3xx (default: true).' },
    { name: 'authOptions', type: 'select', required: false, desc: 'Jenis autentikasi yang digunakan (default: none).', options: ['none', 'basic', 'digest'] },
    { name: 'username', type: 'text', required: false, desc: 'Username untuk autentikasi basic/digest.' },
    { name: 'password', type: 'text', required: false, desc: 'Password untuk autentikasi basic/digest.' }
  ],
  payloadTemplate: {
    host: 'google.com',
    advOptions: 'get',
    acceptCompressedContent: true,
    followRedirects: true,
    authOptions: 'none',
    username: '',
    password: ''
  }
};

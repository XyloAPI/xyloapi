import type { DocTopic } from '../../types';

export const webserverRoute: DocTopic = {
  id: 'webserver',
  title: 'HTTP Response Headers',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/webserver',
  pathTemplate: '/api/info/:slug',
  description: 'Check HTTP response headers, redirect hops, server details, cookies, and cache policies for a domain or URL.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain or URL to check (e.g. google.com or https://xyloapi.qzz.io).' },
    { name: 'advOptions', type: 'select', required: false, desc: 'HTTP request method to use (default: get).', options: ['get', 'head'] },
    { name: 'acceptCompressedContent', type: 'boolean', required: false, desc: 'Accept compressed content encoding (gzip, deflate, br) (default: true).' },
    { name: 'followRedirects', type: 'boolean', required: false, desc: 'Follow HTTP 3xx redirect status locations (default: true).' },
    { name: 'authOptions', type: 'select', required: false, desc: 'Authentication type to use (default: none).', options: ['none', 'basic', 'digest'] },
    { name: 'username', type: 'text', required: false, desc: 'Username for basic/digest authentication.' },
    { name: 'password', type: 'text', required: false, desc: 'Password for basic/digest authentication.' }
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

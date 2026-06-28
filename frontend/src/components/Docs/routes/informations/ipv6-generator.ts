import type { DocTopic } from '../../types';

export const ipv6GeneratorRoute: DocTopic = {
  id: 'ipv6-generator',
  title: 'IPv6 Address Generator',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-generator',
  pathTemplate: '/api/info/:slug',
  description: 'Hasilkan alamat IPv6 unik menggunakan nilai ID Global dan ID Subnet opsional.',
  parameters: [
    { name: 'global_id', type: 'text', required: false, desc: 'Opsional string hex ID global 10 karakter. Akan dihasilkan secara acak jika kosong.' },
    { name: 'subnet_id', type: 'text', required: false, desc: 'Opsional string hex ID global 10 karakter. Akan dihasilkan secara acak jika kosong.' }
  ],
  payloadTemplate: {
    global_id: '3a5e94ff1e',
    subnet_id: 'a286'
  }
};

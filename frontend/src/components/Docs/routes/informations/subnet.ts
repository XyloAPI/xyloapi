import type { DocTopic } from '../../types';

export const subnetRoute: DocTopic = {
  id: 'subnet',
  title: 'Subnet Calculator',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/subnet-calculator',
  pathTemplate: '/api/info/:slug',
  description: 'Hitung detail subnet, alamat jaringan, broadcast, rentang IP yang dapat digunakan, dan daftar CIDR dari IP dengan awalan garis miring opsional.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'Alamat IPv4 dengan atau tanpa awalan CIDR (contoh: 39.42.164.235/24 atau 39.42.164.235).' }
  ],
  payloadTemplate: {
    ip: '39.42.164.235/24'
  }
};

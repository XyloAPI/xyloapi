import type { DocTopic } from '../../types';

export const gempa_dirasakanRoute: DocTopic = {
  id: 'gempa-dirasakan',
  title: 'Gempa Dirasakan',
  category: 'BMKG Indonesia',
  method: 'GET',
  path: '/api/bmkg/gempa-dirasakan',
  pathTemplate: '/api/bmkg/:slug',
  description: 'Ambil daftar gempa bumi terbaru yang dirasakan di Indonesia dari BMKG, lengkap dengan skala MMI dan area terdampak.',
  parameters: [],
  payloadTemplate: {}
};

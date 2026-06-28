import type { DocTopic } from '../../types';

export const weatherRoute: DocTopic = {
  id: 'weather',
  title: 'Weather Forecast',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/weather',
  pathTemplate: '/api/info/:slug',
  description: 'Ambil informasi cuaca secara real-time dan prakiraan cuaca untuk kota atau lokasi yang ditentukan di seluruh dunia.',
  parameters: [
    { name: 'location', type: 'text', required: false, desc: 'Nama kota atau lokasi (default: jakarta).' }
  ],
  payloadTemplate: {
    location: 'jakarta'
  }
};

import type { DocTopic } from '../../types';

export const weatherRoute: DocTopic = {
  id: 'weather',
  title: 'Weather Forecast',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/weather',
  pathTemplate: '/api/info/:slug',
  description: 'Retrieve real-time weather information and forecast for a specified city or location globally.',
  parameters: [
    { name: 'location', type: 'text', required: false, desc: 'City or location name (default: jakarta).' }
  ],
  payloadTemplate: {
    location: 'jakarta'
  }
};

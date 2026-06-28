import type { DocTopic } from '../../types';

export const fakemlRoute: DocTopic = {
  id: 'fakeml',
  title: 'Fake ML',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakeml',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar lobi game Mobile Legends palsu.',
  parameters: [
    { name: 'username', type: 'text', required: false, desc: 'Mobile Legends display username.' },
    { name: 'avatar', type: 'text', required: false, desc: 'URL of the profile avatar image.' },
    { name: 'rank', type: 'select', required: false, desc: 'Lobby rank classification display.', options: ['epic', 'glory', 'gm', 'honor', 'imo', 'legend', 'mawi'] },
    { name: 'border', type: 'select', required: false, desc: 'Lobby frame border selection number (0 for none).', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'] }
  ],
  payloadTemplate: {
    username: 'XyloPlayer',
    avatar: 'https://i.8upload.com/image/f5e48b737fed4821/whats-your-favourite-spongebob-meme-faces-v0-3n524gs6ncde1.webp',
    rank: 'imo',
    border: '0'
  }
};

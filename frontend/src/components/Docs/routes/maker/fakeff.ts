import type { DocTopic } from '../../types';

export const fakeffRoute: DocTopic = {
  id: 'fakeff',
  title: 'Fake Free Fire Lobby',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakeff',
  pathTemplate: '/api/maker/:slug',
  description: 'Hasilkan kartu profil lobi pemain Free Fire tiruan dengan nama pengguna kustom.',
  parameters: [
    { name: 'username', type: 'text', required: true, desc: 'Username to display in the lobby. Max 20 characters.' }
  ],
  payloadTemplate: {
    username: 'DIZZY YAPPER'
  }
};

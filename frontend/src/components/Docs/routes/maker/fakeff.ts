import type { DocTopic } from '../../types';

export const fakeffRoute: DocTopic = {
  id: 'fakeff',
  title: 'Fake Free Fire Lobby',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakeff',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a mock Free Fire in-game player lobby card with a custom username.',
  parameters: [
    { name: 'username', type: 'text', required: true, desc: 'Username to display in the lobby. Max 20 characters.' }
  ],
  payloadTemplate: {
    username: 'DIZZY YAPPER'
  }
};

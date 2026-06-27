import type { DocTopic } from '../../types';

export const fakedmRoute: DocTopic = {
  id: 'fakedm',
  title: 'Fake Instagram DM',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakedm',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate high-fidelity Instagram-style Direct Message (DM) list items. Customize username, avatar, online dot, message text, unread state, verified status, and light/dark theme.',
  parameters: [
    { name: 'username', type: 'text', required: false, desc: 'The username of the sender. Defaults to "username".' },
    { name: 'avatar', type: 'text', required: false, desc: 'Direct URL to the avatar image.' },
    {
      name: 'verified',
      type: 'select',
      required: false,
      desc: 'Whether the user is verified. Defaults to "false".',
      options: ['false', 'true']
    },
    {
      name: 'online',
      type: 'select',
      required: false,
      desc: 'Whether to show the green online indicator dot. Defaults to "true".',
      options: ['true', 'false']
    },
    { name: 'dmText', type: 'text', required: false, desc: 'The message body text. Defaults to "Sent you a message".' },
    { name: 'time', type: 'text', required: false, desc: 'Elapsed message time. Defaults to "1m".' },
    {
      name: 'unread',
      type: 'select',
      required: false,
      desc: 'Whether the message is unread.',
      options: ['false', 'true']
    },
    {
      name: 'theme',
      type: 'select',
      required: false,
      desc: 'Color theme. Defaults to "dark".',
      options: ['dark', 'light']
    }
  ],
  payloadTemplate: {
    username: 'cristiano',
    avatar: 'https://i.imgur.com/HFLXN98.jpeg',
    verified: 'true',
    online: 'true',
    dmText: 'Sent a post by leomessi',
    time: '4m',
    unread: 'true',
    theme: 'dark'
  }
};

import type { DocTopic } from '../../types';

export const fakecommentRoute: DocTopic = {
  id: 'fakecomment',
  title: 'Fake Instagram Comment',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakecomment',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate high-fidelity Instagram-style comment preview cards. Customize username, avatar, comment text, time, likes, verified status, like state, and light/dark theme.',
  parameters: [
    { name: 'username', type: 'text', required: false, desc: 'The username of the commenter. Defaults to "username".' },
    { name: 'avatar', type: 'text', required: false, desc: 'Direct URL to the avatar image.' },
    {
      name: 'verified',
      type: 'select',
      required: false,
      desc: 'Whether the user is verified. Defaults to "false".',
      options: ['false', 'true']
    },
    { name: 'text', type: 'text', required: false, desc: 'The comment text. Defaults to "This is a fake comment!".' },
    { name: 'time', type: 'text', required: false, desc: 'Comment elapsed time. Defaults to "1d".' },
    { name: 'likes', type: 'text', required: false, desc: 'The likes counter text. Defaults to "12".' },
    {
      name: 'liked',
      type: 'select',
      required: false,
      desc: 'Whether the comment is liked.',
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
    avatar: 'https://i.imgur.com/N6myA69.jpeg',
    verified: 'true',
    text: 'Siuuuu! Great work team!',
    time: '2h',
    likes: '14.2k',
    liked: 'true',
    theme: 'dark'
  }
};

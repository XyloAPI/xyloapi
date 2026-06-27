import type { DocTopic } from '../../types';

export const igfeedRoute: DocTopic = {
  id: 'igfeed',
  title: 'Instagram Feed',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/igfeed',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a realistic Instagram feed post mockup with a custom photo, caption, and profile data.',
  parameters: [
    { name: 'username', type: 'text', required: false, desc: 'Instagram username to display.' },
    { name: 'avatar', type: 'text', required: false, desc: 'URL of the profile avatar image.' },
    { name: 'post', type: 'text', required: false, desc: 'URL of the main post photo.' },
    { name: 'caption', type: 'textarea', required: false, desc: 'Post caption text.' },
    { name: 'likes', type: 'text', required: false, desc: 'Number of likes to display (e.g. 4,643 likes).' },
    {
      name: 'theme',
      type: 'select',
      required: false,
      desc: 'Visual interface color theme. Defaults to "light".',
      options: ['light', 'dark']
    }
  ],
  payloadTemplate: {
    username: 'john.doe',
    avatar: 'https://i.imgur.com/9l66omG.jpeg',
    post: 'https://i.imgur.com/BGs3Cu5.jpeg',
    caption: 'Enjoying the view from the top.',
    likes: '4,643 likes',
    theme: 'light'
  }
};

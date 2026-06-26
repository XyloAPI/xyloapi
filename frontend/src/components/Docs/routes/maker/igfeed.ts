import type { DocTopic } from '../../types';

export const igfeedRoute: DocTopic = {
  id: 'igfeed',
  title: 'Instagram Feed',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/igfeed',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate customizable, high-fidelity mock Instagram feed post images with options for avatars, custom post photos, custom captions, counts, and dark/light themes.',
  parameters: [
    { name: 'username', type: 'text', required: false, desc: 'The poster username' },
    { name: 'avatar', type: 'text', required: false, desc: 'URL of the profile avatar image. Supports custom online images.' },
    { name: 'post', type: 'text', required: false, desc: 'URL of the main post photo. Supports custom online images.' },
    { name: 'caption', type: 'textarea', required: false, desc: 'The post text caption' },
    { name: 'likes', type: 'text', required: false, desc: 'Number of likes string.' },
    {
      name: 'theme',
      type: 'select',
      required: false,
      desc: 'Visual interface color theme. Defaults to "light".',
      options: ['light', 'dark']
    }
  ],
  payloadTemplate: {
    username: 'ayam goreng',
    avatar: 'https://i.imgur.com/9l66omG.jpeg',
    post: 'https://i.imgur.com/BGs3Cu5.jpeg',
    caption: 'ini ayam goreng atau bukan ya',
    likes: '4,643 likes',
    theme: 'light'
  }
};

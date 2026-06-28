import type { DocTopic } from '../../types';

export const faketweetRoute: DocTopic = {
  id: 'faketweet',
  title: 'Fake Tweet',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/faketweet',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat mockup cuitan Twitter/X yang realistis dengan pembuat dan isi pesan kustom.',
  parameters: [
    { name: 'name', type: 'text', required: false, desc: 'Display name of the user. Defaults to "Twitter".' },
    { name: 'username', type: 'text', required: false, desc: 'Username handle of the user. Defaults to "twitter".' },
    { name: 'avatar', type: 'text', required: false, desc: 'URL of the profile avatar image. Supports custom online images.' },
    { name: 'text', type: 'textarea', required: false, desc: 'The tweet message to render. Defaults to "This is a fake tweet".' },
    {
      name: 'verified',
      type: 'select',
      required: false,
      desc: 'Show blue verification checkmark. Defaults to "true".',
      options: ['true', 'false']
    },
    {
      name: 'locked',
      type: 'select',
      required: false,
      desc: 'Show padlock icon (private/locked account). Defaults to "false".',
      options: ['false', 'true']
    },
    {
      name: 'theme',
      type: 'select',
      required: false,
      desc: 'Visual interface color theme. Defaults to "light".',
      options: ['light', 'dark']
    },
    { name: 'retweets', type: 'text', required: false, desc: 'Number of retweets to display. Defaults to "32K".' },
    { name: 'quotes', type: 'text', required: false, desc: 'Number of quote tweets to display. Defaults to "100".' },
    { name: 'likes', type: 'text', required: false, desc: 'Number of likes to display. Defaults to "12.7K".' },
    { name: 'date', type: 'text', required: false, desc: 'Custom date string. Defaults to today.' },
    { name: 'time', type: 'text', required: false, desc: 'Custom time string. Defaults to current time.' },
    { name: 'device', type: 'text', required: false, desc: 'Device metadata source name. Defaults to "Twitter for iPhone".' }
  ],
  payloadTemplate: {
    name: 'Twitter',
    username: 'twitter',
    avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
    text: 'This is a fake tweet',
    verified: 'true',
    locked: 'false',
    theme: 'light',
    retweets: '32K',
    quotes: '100',
    likes: '12.7K',
    device: 'Twitter for iPhone'
  }
};

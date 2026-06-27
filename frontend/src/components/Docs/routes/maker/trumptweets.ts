import type { DocTopic } from '../../types';

export const trumpTweetsRoute: DocTopic = {
  id: 'trumptweets',
  title: 'Trump Tweets',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/trumptweets',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate Donald Trump tweets with custom text.',
  parameters: [
    { name: 'text', type: 'textarea', required: false, desc: 'The tweet message to render. Defaults to "MAKE AMERICA GREAT AGAIN!".' },
    {
      name: 'theme',
      type: 'select',
      required: false,
      desc: 'Visual interface color theme. Defaults to "light".',
      options: ['light', 'dark']
    },
    { name: 'retweets', type: 'text', required: false, desc: 'Number of retweets to display. Defaults to "14.5K".' },
    { name: 'quotes', type: 'text', required: false, desc: 'Number of quote tweets to display. Defaults to "3.2K".' },
    { name: 'likes', type: 'text', required: false, desc: 'Number of likes to display. Defaults to "128K".' },
    { name: 'date', type: 'text', required: false, desc: 'Custom date string. Defaults to today.' },
    { name: 'time', type: 'text', required: false, desc: 'Custom time string. Defaults to current time.' },
    { name: 'device', type: 'text', required: false, desc: 'Device metadata source name. Defaults to "Twitter for iPhone".' }
  ],
  payloadTemplate: {
    text: 'MAKE AMERICA GREAT AGAIN!',
    theme: 'light',
    retweets: '14.5K',
    quotes: '3.2K',
    likes: '128K',
    device: 'Twitter for iPhone'
  }
};

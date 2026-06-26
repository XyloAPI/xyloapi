import type { DocTopic } from '../../types';

export const nokiaRoute: DocTopic = {
  id: 'nokia',
  title: 'Nokia Message',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/nokia',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a retro Nokia monophonic phone screen displaying a custom text message and details.',
  parameters: [
    { name: 'message', type: 'text', required: true, desc: 'The main message body content.' },
    { name: 'header', type: 'text', required: false, desc: 'The text displayed on the top status header.' },
    { name: 'sender', type: 'text', required: false, desc: 'The sender name displayed in the message metadata.' },
    { name: 'date', type: 'text', required: false, desc: 'The message date (Format: DD/MM/YYYY).' },
    { name: 'time', type: 'text', required: false, desc: 'The message time (Format: HH:MM).' }
  ],
  payloadTemplate: {
    message: 'di benci ga masalah di sukai makasih, bee your self, berdiri di atas kaki sendiri🫷',
    header: 'Andri',
    sender: 'Andri',
    date: '02/05/2026',
    time: '11:28'
  }
};

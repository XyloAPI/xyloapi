import type { DocTopic } from '../../types';

export const ytlogoRoute: DocTopic = {
  id: 'ytlogo',
  title: 'YouTube Logo',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/ytlogo',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar teks logo kustom dengan gaya klasik YouTube.',
  parameters: [
    { name: 'you', type: 'text', required: false, desc: 'The left text content. Defaults to "You".' },
    { name: 'tube', type: 'text', required: false, desc: 'The right text content (inside the rounded box). Defaults to "Tube".' },
    { name: 'youfontsize', type: 'text', required: false, desc: 'Font size in pixels for the left text. Defaults to "100".' },
    { name: 'tubefontsize', type: 'text', required: false, desc: 'Font size in pixels for the right text. Defaults to "100".' },
    {
      name: 'bold',
      type: 'select',
      required: false,
      desc: 'Bold font styling option. Defaults to "bold".',
      options: ['bold', 'normal']
    },
    { name: 'bgwidth', type: 'text', required: false, desc: 'Width of the output image canvas. Defaults to "480".' },
    { name: 'bgheight', type: 'text', required: false, desc: 'Height of the output image canvas. Defaults to "480".' },
    { name: 'bgcolor', type: 'color', required: false, desc: 'Background color of the canvas. Defaults to "rgb(238,28,27)".' },
    { name: 'rightbgcolor', type: 'color', required: false, desc: 'Background color of the right text box. Defaults to "#FFFFFF".' },
    { name: 'leftcolor', type: 'color', required: false, desc: 'Text color of the left content. Defaults to "#FFFFFF".' },
    { name: 'rightcolor', type: 'color', required: false, desc: 'Text color of the right content inside the box. Defaults to "rgb(238,28,27)".' }
  ],
  payloadTemplate: {
    you: 'You',
    tube: 'Tube',
    youfontsize: '100',
    tubefontsize: '100',
    bold: 'bold',
    bgwidth: '480',
    bgheight: '480',
    bgcolor: 'rgb(238,28,27)',
    rightbgcolor: '#FFFFFF',
    leftcolor: '#FFFFFF',
    rightcolor: 'rgb(238,28,27)'
  }
};

import type { DocTopic } from '../../types';

export const phlogoRoute: DocTopic = {
  id: 'phlogo',
  title: 'Pornhub Logo',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/phlogo',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar teks logo kustom dengan gaya ikonik Pornhub.',
  parameters: [
    { name: 'porn', type: 'text', required: false, desc: 'The left text content (usually white). Defaults to "Porn".' },
    { name: 'hub', type: 'text', required: false, desc: 'The right text content (usually black inside orange box). Defaults to "Hub".' },
    { name: 'fontsize', type: 'text', required: false, desc: 'Font size in pixels. Defaults to "100".' },
    {
      name: 'bold',
      type: 'select',
      required: false,
      desc: 'Bold font styling option. Defaults to "bold".',
      options: ['bold', 'normal']
    },
    { name: 'bgwidth', type: 'text', required: false, desc: 'Width of the output image canvas. Defaults to "480".' },
    { name: 'bgheight', type: 'text', required: false, desc: 'Height of the output image canvas. Defaults to "480".' },
    { name: 'bgcolor', type: 'color', required: false, desc: 'Background color of the canvas. Defaults to "#000000".' },
    { name: 'rightbgcolor', type: 'color', required: false, desc: 'Background color of the right text box. Defaults to "rgb(254,154,0)".' },
    { name: 'leftcolor', type: 'color', required: false, desc: 'Text color of the left content. Defaults to "#FFFFFF".' },
    { name: 'rightcolor', type: 'color', required: false, desc: 'Text color of the right content inside the box. Defaults to "#000000".' }
  ],
  payloadTemplate: {
    porn: 'Porn',
    hub: 'Hub',
    fontsize: '100',
    bold: 'bold',
    bgwidth: '480',
    bgheight: '480',
    bgcolor: '#000000',
    rightbgcolor: 'rgb(254,154,0)',
    leftcolor: '#FFFFFF',
    rightcolor: '#000000'
  }
};

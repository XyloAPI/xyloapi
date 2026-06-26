import type { DocTopic } from '../../types';

export const qr_generatorRoute: DocTopic = {
    id: 'qr-generator',
    title: 'QR Code Generator',
    category: 'QR Tools',
    method: 'GET',
    path: '/api/qr-tool/generate',
    pathTemplate: '/api/qr-tool/:slug',
    description: 'Generate high-quality customizable QR Codes online instantly. Enter your data, customize the size, margin, and color.',
    parameters: [
      { name: 'data', type: 'text', required: true, desc: 'The text or URL to encode into the QR code.' },
      { name: 'size', type: 'text', required: false, desc: 'Size in widthxheight format (e.g. 500x500 or 1000x1000). Default is 500x500.' },
      { name: 'margin', type: 'number', required: false, desc: 'Quiet margin around the QR code. Default is 1.' },
      { name: 'color', type: 'text', required: false, desc: 'Hex color code of the QR code pixels (e.g. "#ff00bb" or "#000000"). Default is "#000000".' }
    ],
    payloadTemplate: {
      data: 'Example',
      size: '500x500',
      margin: 1,
      color: '#000000'
    }
  };

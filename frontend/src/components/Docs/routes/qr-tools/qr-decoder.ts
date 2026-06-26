import type { DocTopic } from '../../types';

export const qr_decoderRoute: DocTopic = {
    id: 'qr-decoder',
    title: 'QR Code Decoder',
    category: 'QR Tools',
    method: 'POST',
    path: '/api/qr-tool/qr-decode',
    pathTemplate: '/api/qr-tool/:slug',
    description: 'Decode and extract text content from any QR Code or barcode image. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

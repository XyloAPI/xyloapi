import type { DocTopic } from '../../types';

export const qr_decoderRoute: DocTopic = {
    id: 'qr-decoder',
    title: 'QR Code Decoder',
    category: 'QR Tools',
    method: 'POST',
    path: '/api/qr-tool/qr-decode',
    pathTemplate: '/api/qr-tool/:slug',
    description: 'Dekode dan ekstrak konten teks dari gambar QR Code atau barcode apa pun. Unggah file gambar atau berikan URL gambar langsung.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };

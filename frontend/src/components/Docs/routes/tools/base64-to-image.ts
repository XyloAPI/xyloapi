import type { DocTopic } from '../../types';

export const base64ToImageRoute: DocTopic = {
  id: 'base64-to-image',
  title: 'Base64 to Image Converter',
  category: 'Dev Tools',
  method: 'POST',
  path: '/api/tools/base64-to-image',
  pathTemplate: '/api/tools/:slug',
  description: 'Ubah string yang dienkode Base64 kembali menjadi format gambar yang dapat dilihat dan diunduh.',
  parameters: [
    { name: 'base64', type: 'textarea', required: true, desc: 'Base64 string of the image (with or without data:image/png;base64 prefix).' }
  ],
  payloadTemplate: {
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  }
};

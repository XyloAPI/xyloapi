import type { DocTopic } from '../../types';

export const iphoneGalleryRoute: DocTopic = {
  id: 'iphonegallery',
  title: 'iPhone Gallery',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/iphonegallery',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat mockup galeri foto iPhone berkualitas tinggi yang menampilkan gambar kustom.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the photo to display.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/z0bVpgs.jpeg'
  }
};

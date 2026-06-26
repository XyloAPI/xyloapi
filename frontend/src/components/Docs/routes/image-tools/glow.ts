import type { DocTopic } from '../../types';

export const glowRoute: DocTopic = {
    id: 'glow',
    title: 'Glow Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/glow',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Add a beautiful, radiant glow effect with custom color, intensity, and blur radius to your images online. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'intensity', type: 'number', required: false, desc: 'Glow intensity from 1 to 100. Default is 20.' },
      { name: 'radius', type: 'number', required: false, desc: 'Glow blur radius from 1 to 50. Default is 10.' },
      { name: 'color', type: 'text', required: false, desc: 'Hex color code of the glow (e.g. "#ffffff" or "#ff00bb"). Default is "#ffffff".' }
    ],
    payloadTemplate: {
      image: '',
      intensity: 20,
      radius: 10,
      color: '#ffffff'
    }
  };

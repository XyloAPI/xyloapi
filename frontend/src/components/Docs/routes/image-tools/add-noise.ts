import type { DocTopic } from '../../types';

export const add_noiseRoute: DocTopic = {
    id: 'add-noise',
    title: 'Add Noise',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/add-noise',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Add random noise to your images online. Select the noise type (Gaussian, Uniform, or Salt & Pepper) and specify the intensity amount.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'amount', type: 'number', required: false, desc: 'Noise amount from 0 to 100. Default is 20.' },
      {
        name: 'noise_type',
        type: 'select',
        required: false,
        desc: 'Type of noise to generate: "gaussian", "uniform", or "salt_and_pepper". Default is "gaussian".',
        options: [
          { value: 'gaussian', label: 'Gaussian (Film Grain)' },
          { value: 'uniform', label: 'Uniform Noise' },
          { value: 'salt_and_pepper', label: 'Salt & Pepper Noise' }
        ]
      } as any
    ],
    payloadTemplate: {
      image: '',
      amount: 20,
      noise_type: 'gaussian'
    }
  };

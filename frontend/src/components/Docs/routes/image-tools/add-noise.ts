import type { DocTopic } from '../../types';

export const add_noiseRoute: DocTopic = {
    id: 'add-noise',
    title: 'Add Noise',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/add-noise',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Tambahkan noise acak ke gambar secara online. Pilih jenis noise (Gaussian, Uniform, atau Salt & Pepper) dan tentukan tingkat intensitasnya.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'amount', type: 'number', required: false, desc: 'Jumlah noise dari 0 hingga 100. Default adalah 20.' },
      {
        name: 'noise_type',
        type: 'select',
        required: false,
        desc: "Jenis noise yang dihasilkan: 'gaussian', 'uniform', atau 'salt_and_pepper'. Default adalah 'gaussian'.",
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

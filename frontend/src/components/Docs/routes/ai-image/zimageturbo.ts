import type { DocTopic } from '../../types';

export const zimageturboRoute: DocTopic = {
  id: 'zimageturbo',
  title: 'Z-Image Turbo',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/zimageturbo',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Hasilkan gambar berdefinisi tinggi menggunakan Z-Image Turbo dengan kemampuan penalaran cepat dan prompt negatif.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' },
    { name: 'negative_prompt', type: 'text', required: false, desc: 'Deskripsi tentang apa yang harus dihindari dalam gambar yang dihasilkan.' }
  ],
  payloadTemplate: {
    prompt: '',
    negative_prompt: ''
  }
};

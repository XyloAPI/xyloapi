import type { DocTopic } from '../../types';

export const passwordGeneratorRoute: DocTopic = {
  id: 'password-generator',
  title: 'Secure Password Generator',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/password-generator',
  pathTemplate: '/api/info/:slug',
  description: 'Hasilkan kata sandi kuat berbasis kriptografi entropi tinggi dengan panjang kustom, set karakter, dan persyaratan keunikan.',
  parameters: [
    { name: 'length', type: 'number', required: false, desc: 'Panjang karakter kata sandi (default: 16, min: 4, maks: 128).' },
    { name: 'num', type: 'number', required: false, desc: 'Jumlah kata sandi yang dihasilkan (default: 1, min: 1, maks: 100).' },
    { name: 'lowercase', type: 'boolean', required: false, desc: 'Sertakan huruf kecil a-z (default: true).' },
    { name: 'uppercase', type: 'boolean', required: false, desc: 'Sertakan huruf besar A-Z (default: true).' },
    { name: 'digits', type: 'boolean', required: false, desc: 'Sertakan angka 0-9 (default: true).' },
    { name: 'basicsymbol', type: 'boolean', required: false, desc: 'Sertakan karakter spesial dasar (default: true).' },
    { name: 'moresymbol', type: 'boolean', required: false, desc: 'Sertakan karakter spesial lanjutan (default: false).' },
    { name: 'skipsimilar', type: 'boolean', required: false, desc: 'Hindari karakter ambigu seperti 0, O, I, 1, l (default: false).' },
    { name: 'unique', type: 'boolean', required: false, desc: 'Wajibkan karakter unik (default: false).' },
    { name: 'weighted', type: 'boolean', required: false, desc: 'Mendistribusikan karakter secara merata (default: false).' }
  ],
  payloadTemplate: {
    length: 16,
    num: 1,
    lowercase: true,
    uppercase: true,
    digits: true,
    basicsymbol: true,
    moresymbol: false,
    skipsimilar: false,
    unique: false,
    weighted: false
  }
};

import type { DocTopic } from '../../types';

export const kuitansiRoute: DocTopic = {
  id: 'kuitansi',
  title: 'Kuitansi',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/kuitansi',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a mock "Kuitansi" (Receipt) with a custom receipt number, date, amount, items description, and recipient signature.',
  parameters: [
    { name: 'nomor', type: 'text', required: false, desc: 'Receipt reference number. Defaults to "234".' },
    { name: 'dari', type: 'text', required: false, desc: 'Payer name (Telah terima dari). Defaults to "Ibnu Maksum".' },
    { name: 'sejumlah', type: 'text', required: false, desc: 'Payment amount spelled out in words. Defaults to "satu juta lima ratus empat puluh lima rupiah".' },
    { name: 'untuk1', type: 'text', required: false, desc: 'Payment description - line 1. Defaults to "Pembayaran".' },
    { name: 'untuk2', type: 'text', required: false, desc: 'Payment description - line 2. Defaults to "Uang Muka Rumah".' },
    { name: 'untuk3', type: 'text', required: false, desc: 'Payment description - line 3. Defaults to "Uang Muka Mobil".' },
    { name: 'jumlah', type: 'text', required: false, desc: 'Amount in numbers (Rp.). Defaults to "1.000.545,-".' },
    { name: 'lokasi', type: 'text', required: false, desc: 'Location and date. Defaults to "Kota Serang, 12 Maret 2024".' },
    { name: 'nama', type: 'text', required: false, desc: 'Recipient name. Defaults to "Ibnu Maksum".' }
  ],
  payloadTemplate: {
    nomor: '234',
    dari: 'Ibnu Maksum',
    sejumlah: 'satu juta lima ratus empat puluh lima rupiah',
    untuk1: 'Pembayaran',
    untuk2: 'Uang Muka Rumah',
    untuk3: 'Uang Muka Mobil',
    jumlah: '1.000.545,-',
    lokasi: 'Kota Serang, 12 Maret 2024',
    nama: 'Ibnu Maksum'
  }
};
export const kwitansiRoute = { ...kuitansiRoute, id: 'kwitansi', title: 'Kwitansi', path: '/api/maker/kwitansi' };

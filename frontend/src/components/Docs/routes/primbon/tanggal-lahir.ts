import type { DocTopic } from '../../types';

export const tanggalLahirRoute: DocTopic = {
  id: 'tanggal-lahir',
  title: 'Hari, Tanggal & Bulan Lahir',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/tanggal-lahir',
  pathTemplate: '/api/primbon/:slug',
  description: 'Membaca sifat dan karakter seseorang berdasarkan hari lahir, tanggal lahir, dan/atau bulan lahir menurut Primbon Jawa.',
  parameters: [
    {
      name: 'hari',
      type: 'select',
      required: false,
      desc: 'Hari lahir.',
      options: [
        { value: 'Senin', label: 'Senin' },
        { value: 'Selasa', label: 'Selasa' },
        { value: 'Rabu', label: 'Rabu' },
        { value: 'Kamis', label: 'Kamis' },
        { value: 'Jumat', label: 'Jumat' },
        { value: 'Sabtu', label: 'Sabtu' },
        { value: 'Minggu', label: 'Minggu' }
      ]
    },
    {
      name: 'tanggal',
      type: 'select',
      required: false,
      desc: 'Tanggal lahir (1–31).',
      options: Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1),
        label: `Tanggal ${i + 1}`
      }))
    },
    {
      name: 'bulan',
      type: 'select',
      required: false,
      desc: 'Bulan lahir.',
      options: [
        { value: 'Januari', label: 'Januari' },
        { value: 'Februari', label: 'Februari' },
        { value: 'Maret', label: 'Maret' },
        { value: 'April', label: 'April' },
        { value: 'Mei', label: 'Mei' },
        { value: 'Juni', label: 'Juni' },
        { value: 'Juli', label: 'Juli' },
        { value: 'Agustus', label: 'Agustus' },
        { value: 'September', label: 'September' },
        { value: 'Oktober', label: 'Oktober' },
        { value: 'November', label: 'November' },
        { value: 'Desember', label: 'Desember' }
      ]
    }
  ],
  payloadTemplate: {
    hari: 'Senin',
    tanggal: '1',
    bulan: 'Januari'
  }
};

import type { DocTopic } from '../../types';

export const snbpRoute: DocTopic = {
  id: 'snbp',
  title: 'Fake SNBP Announcement',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/snbp',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar kartu pengumuman seleksi SNBP palsu.',
  parameters: [
    { name: 'status', type: 'text', required: false, desc: 'Selection status: "1" for Lulus (Accepted), "0" for Tidak Lulus (Rejected).' },
    { name: 'tahun', type: 'text', required: false, desc: 'Custom year (e.g. "2025", "2026"). Defaults to "2025".' },
    { name: 'name', type: 'text', required: true, desc: 'Full name of the student.' },
    { name: 'no_peserta', type: 'text', required: false, desc: 'Registration number (Noreg/Nomor Peserta).' },
    { name: 'nisn', type: 'text', required: false, desc: 'Student NISN.' },
    { name: 'prodi', type: 'text', required: false, desc: 'Program study name.' },
    { name: 'univ', type: 'text', required: false, desc: 'University/PTN name.' },
    { name: 'tgl_lahir', type: 'text', required: false, desc: 'Date of birth.' },
    { name: 'sekolah', type: 'text', required: false, desc: 'Origin school name.' },
    { name: 'kab', type: 'text', required: false, desc: 'Regency/City.' },
    { name: 'prov', type: 'text', required: false, desc: 'Province.' },
    { name: 'link', type: 'text', required: false, desc: 'Registration link for PTN (only for status="1").' }
  ],
  payloadTemplate: {
    status: '1',
    tahun: '2025',
    name: 'AHMAD LULUS PRATAMA',
    no_peserta: '4251234567',
    nisn: '0061234567',
    prodi: 'TEKNIK INFORMATIKA - S1',
    univ: 'UNIVERSITAS DIPONEGORO',
    tgl_lahir: '17 Oktober 2006',
    sekolah: 'SMA NEGERI 1 SEMARANG',
    kab: 'KOTA SEMARANG',
    prov: 'PROV. JAWA TENGAH',
    link: 'https://pmb.undip.ac.id/'
  }
};

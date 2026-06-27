import type { DocTopic } from '../../types';

export const snbtRoute: DocTopic = {
  id: 'snbt',
  title: 'Fake SNBT Announcement',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/snbt',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a mock UTBK-SNBT selection announcement card.',
  parameters: [
    { name: 'status', type: 'text', required: false, desc: 'Selection status: "1" for Lulus (Accepted), "0" for Tidak Lulus (Rejected).' },
    { name: 'tahun', type: 'text', required: false, desc: 'Custom year (e.g. "2026", "2025"). Defaults to "2026".' },
    { name: 'name', type: 'text', required: true, desc: 'Full name of the student.' },
    { name: 'no_peserta', type: 'text', required: false, desc: '12-digit UTBK-SNBT registration number.' },
    { name: 'tgl_lahir', type: 'text', required: false, desc: 'Date of birth (DD-MM-YYYY).' },
    { name: 'kode_ptn', type: 'text', required: false, desc: '3-digit PTN code (only for status="1").' },
    { name: 'nama_ptn', type: 'text', required: false, desc: 'PTN/University name (only for status="1").' },
    { name: 'kode_prodi', type: 'text', required: false, desc: '7-digit Program study code (only for status="1").' },
    { name: 'nama_prodi', type: 'text', required: false, desc: 'Program study name (only for status="1").' },
    { name: 'kip', type: 'text', required: false, desc: 'KIP Kuliah verifikasi notice: "1" to show warning, "0" to hide.' },
    { name: 'link', type: 'text', required: false, desc: 'Registration link for PTN (only for status="1").' }
  ],
  payloadTemplate: {
    status: '1',
    tahun: '2026',
    name: 'AHMAD LULUS PRATAMA',
    no_peserta: '12-3456-789012',
    tgl_lahir: '01-02-2006',
    kode_ptn: '000',
    nama_ptn: 'UNIVERSITAS NEGERI',
    kode_prodi: '1234567',
    nama_prodi: 'PRODI',
    kip: '0',
    link: 'https://pmb.univ.ac.id/'
  }
};

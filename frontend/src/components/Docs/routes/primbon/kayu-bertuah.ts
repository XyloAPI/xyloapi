import type { DocTopic } from '../../types';

export const kayuBertuahRoute: DocTopic = {
  id: 'kayu-bertuah',
  title: 'Kayu Bertuah',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/kayu-bertuah',
  pathTemplate: '/api/primbon/:slug',
  description: 'Mendapatkan khasiat dan tuah dari jenis kayu bertuah pilihan menurut mitologi dan kepercayaan Jawa.',
  parameters: [
    {
      name: 'kayu',
      type: 'select',
      required: true,
      desc: 'Pilih jenis kayu bertuah.',
      options: [
        { value: '1', label: 'Asam Jawa' },
        { value: '2', label: 'Awar-awar' },
        { value: '3', label: 'Bambu Buntet / Pethuk' },
        { value: '4', label: 'Boga' },
        { value: '5', label: 'Bambu Apus Pringgolayan' },
        { value: '6', label: 'Lingsar' },
        { value: '7', label: 'Klumpit' },
        { value: '8', label: 'Wergu' },
        { value: '9', label: 'Songgo Langit' },
        { value: '10', label: 'Pule / Pulai' },
        { value: '11', label: 'Rumput Fatimah' },
        { value: '12', label: 'Minging' },
        { value: '13', label: 'Cendana' },
        { value: '14', label: 'Drini / Sentigi' },
        { value: '15', label: 'Dewadaru' },
        { value: '16', label: 'Kayu Itam / Ebony' },
        { value: '17', label: 'Kebak' },
        { value: '18', label: 'Kelor / Maronggi' },
        { value: '19', label: 'Kengkeng' },
        { value: '20', label: 'Krangeyan' },
        { value: '21', label: 'Liwung' },
        { value: '22', label: 'Lotrok' },
        { value: '23', label: 'Mimang' },
        { value: '24', label: 'Pamrih & Ringin Sepuh' },
        { value: '25', label: 'Nagasari' },
        { value: '26', label: 'Rotan Poleng' },
        { value: '27', label: 'Secang' },
        { value: '28', label: 'Sempu' },
        { value: '29', label: 'Setigi / Kayu Sulaiman' },
        { value: '30', label: 'Stigi' },
        { value: '31', label: 'Kalimasada' },
        { value: '32', label: 'Gaharu' },
        { value: '33', label: 'Nogosari' }
      ]
    }
  ],
  payloadTemplate: {
    kayu: '1'
  }
};

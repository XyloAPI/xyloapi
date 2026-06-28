import type { DocTopic } from '../../types';

export const gdriveRoute: DocTopic = {
    id: 'gdrive',
    title: 'Google Drive Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/gdrive',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh file dan ekspor Google Docs, Sheets, serta Slides langsung dari tautan berbagi Google Drive.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL berbagi Google Drive atau Google Docs.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

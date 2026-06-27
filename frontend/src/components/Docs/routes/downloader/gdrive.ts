import type { DocTopic } from '../../types';

export const gdriveRoute: DocTopic = {
    id: 'gdrive',
    title: 'Google Drive Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/gdrive',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download files and export Google Docs, Sheets, and Slides directly from Google Drive sharing URLs.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Google Drive / Docs share URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

import type { DocTopic } from '../../types';

export const soundcloudRoute: DocTopic = {
  id: 'soundcloud',
  title: 'SoundCloud Downloader',
  category: 'Downloader',
  method: 'POST',
  path: '/api/downloader/soundcloud',
  pathTemplate: '/api/downloader/:slug',
  description: 'Unduh trek audio SoundCloud dalam format MP3 berkualitas tinggi.',
  parameters: [
    { name: 'url', type: 'text', required: true, desc: 'URL publik trek SoundCloud.' }
  ],
  payloadTemplate: {
    url: ''
  }
};

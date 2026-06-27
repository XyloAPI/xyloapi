import type { DocTopic } from '../../types';

export const soundcloudRoute: DocTopic = {
    id: 'soundcloud',
    title: 'SoundCloud Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/soundcloud',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download SoundCloud tracks in high-quality MP3 audio.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'public SoundCloud track URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

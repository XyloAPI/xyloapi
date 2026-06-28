import type { DocTopic } from '../../types';

export const spotifyRoute: DocTopic = {
    id: 'spotify',
    title: 'Spotify Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/spotify',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh lagu Spotify dalam format MP3 berkualitas tinggi (320kbps).',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL publik lagu Spotify.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

import type { DocTopic } from '../../types';

export const spotifyRoute: DocTopic = {
    id: 'spotify',
    title: 'Spotify Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/spotify',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Spotify tracks in high-quality 320kbps MP3 audio.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'public Spotify track URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

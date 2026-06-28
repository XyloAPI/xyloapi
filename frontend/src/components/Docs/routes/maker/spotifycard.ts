import type { DocTopic } from '../../types';

export const spotifycardRoute: DocTopic = {
  id: 'spotifycard',
  title: 'Spotify Player Card',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/spotifycard',
  pathTemplate: '/api/maker/:slug',
  description: 'Hasilkan kartu pemutar musik bergaya aplikasi Spotify.',
  parameters: [
    { name: 'title', type: 'text', required: false, desc: 'The title of the song/track. Defaults to "STAY HERE 4 LIFE".' },
    { name: 'artist', type: 'text', required: false, desc: 'The name of the artist(s). Defaults to "A$AP Rocky".' },
    { name: 'cover', type: 'text', required: false, desc: 'Direct URL to the album cover image. Fallback to default if empty.' },
    { name: 'progress', type: 'number', required: false, desc: 'Playback progress percentage from 0 to 100. Defaults to 40.' },
    { name: 'current_time', type: 'text', required: false, desc: 'Currently elapsed playback time. Defaults to "1:24".' },
    { name: 'duration', type: 'text', required: false, desc: 'Total song duration. Defaults to "3:35".' },
    {
      name: 'status',
      type: 'select',
      required: false,
      desc: 'The player state. Defaults to "playing".',
      options: ['playing', 'paused']
    }
  ],
  payloadTemplate: {
    title: 'Attention',
    artist: 'Charlie Puth',
    cover: 'https://i.imgur.com/zflNW7n.jpeg',
    progress: 40,
    current_time: '1:24',
    duration: '3:35',
    status: 'playing'
  }
};

import type { DocTopic } from '../../types';

export const phRoute: DocTopic = {
    id: 'ph',
    title: 'Pornhub Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/ph',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Pornhub videos in multiple resolutions (240p up to 1080p). Supports both direct MP4 downloads and HLS stream formats.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Pornhub video URL (e.g. https://www.pornhub.com/view_video.php?viewkey=6a281627061fa).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

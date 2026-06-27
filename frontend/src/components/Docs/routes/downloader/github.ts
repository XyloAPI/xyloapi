import type { DocTopic } from '../../types';

export const githubRoute: DocTopic = {
    id: 'github',
    title: 'GitHub Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/github',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download repositories, releases, release assets, specific branches, single files, or folders from GitHub.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'GitHub Repository, Release, File, or Folder URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };

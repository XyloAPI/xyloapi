import type { DocTopic } from '../../types';

export const mothershipRoute: DocTopic = {
    id: 'mothership',
    title: 'Mothership SG',
    category: 'News',
    method: 'POST',
    path: '/api/news/mothership',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news articles from Mothership.sg — Singapore\'s leading digital news platform. Returns up to 25 articles with title, image, author, description, and publish date.',
    parameters: [],
    payloadTemplate: {}
  };

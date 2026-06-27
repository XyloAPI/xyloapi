import type { DocTopic } from '../../types';

export const urlParserRoute: DocTopic = {
  id: 'url-parser',
  title: 'URL Parser & Analyzer',
  category: 'Dev Tools',
  method: 'GET',
  path: '/api/info/url-parser',
  pathTemplate: '/api/info/:slug',
  description: 'Parse a URL into its constituent parts including protocol, domain, subdomain, port, pathname, search query, and hash components.',
  parameters: [
    { name: 'url', type: 'text', required: true, desc: 'The full URL string to parse and analyze.' }
  ],
  payloadTemplate: {
    url: 'https://user:password@sub.example.com:8080/path/to/resource?search=query#section'
  }
};

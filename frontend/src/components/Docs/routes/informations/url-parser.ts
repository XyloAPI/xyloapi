import type { DocTopic } from '../../types';

export const urlParserRoute: DocTopic = {
  id: 'url-parser',
  title: 'URL Parser & Analyzer',
  category: 'Dev Tools',
  method: 'GET',
  path: '/api/info/url-parser',
  pathTemplate: '/api/info/:slug',
  description: 'Urai (parse) URL menjadi bagian-bagian penyusunnya, termasuk protokol, domain, subdomain, port, pathname, kueri pencarian, dan komponen hash.',
  parameters: [
    { name: 'url', type: 'text', required: true, desc: 'String URL lengkap yang akan diurai dan dianalisis.' }
  ],
  payloadTemplate: {
    url: 'https://user:password@sub.example.com:8080/path/to/resource?search=query#section'
  }
};

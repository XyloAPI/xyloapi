import type { DocTopic } from '../../types';

export const ipblacklistRoute: DocTopic = {
  id: 'ip-blacklist',
  title: 'IP Blacklist Checker',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip-blacklist',
  pathTemplate: '/api/info/:slug',
  description: 'Check if an IP address or domain is blacklisted across 50+ DNSBL databases (Spamhaus, Sorbs, Barracuda, etc.).',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'IP address or domain name to check (e.g. 1.1.1.1 or google.com).' }
  ],
  payloadTemplate: {
    ip: 'google.com'
  }
};

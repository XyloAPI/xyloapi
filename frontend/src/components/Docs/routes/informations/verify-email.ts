import type { DocTopic } from '../../types';

export const verifyemailRoute: DocTopic = {
  id: 'verify-email',
  title: 'Validate Email Address',
  category: 'Email Tools',
  method: 'GET',
  path: '/api/info/verify-email',
  pathTemplate: '/api/info/:slug',
  description: 'Validate and verify if an email address exists and is capable of receiving emails.',
  parameters: [
    { name: 'email', type: 'text', required: true, desc: 'Email address to verify (e.g. example@gmail.com).' }
  ],
  payloadTemplate: {
    email: 'me.lvi.ng.om.ez.640@gmail.com'
  }
};

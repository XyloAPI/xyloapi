import type { DocTopic } from '../../types';

export const passwordGeneratorRoute: DocTopic = {
  id: 'password-generator',
  title: 'Secure Password Generator',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/password-generator',
  pathTemplate: '/api/info/:slug',
  description: 'Generate high-entropy cryptographically strong passwords with custom length, character sets, and uniqueness requirements.',
  parameters: [
    { name: 'length', type: 'number', required: false, desc: 'Password character length (default: 16, min: 4, max: 128).' },
    { name: 'num', type: 'number', required: false, desc: 'Number of passwords to generate (default: 1, min: 1, max: 100).' },
    { name: 'lowercase', type: 'boolean', required: false, desc: 'Include lowercase letters a-z (default: true).' },
    { name: 'uppercase', type: 'boolean', required: false, desc: 'Include uppercase letters A-Z (default: true).' },
    { name: 'digits', type: 'boolean', required: false, desc: 'Include digits 0-9 (default: true).' },
    { name: 'basicsymbol', type: 'boolean', required: false, desc: 'Include basic special characters (default: true).' },
    { name: 'moresymbol', type: 'boolean', required: false, desc: 'Include advanced special characters (default: false).' },
    { name: 'skipsimilar', type: 'boolean', required: false, desc: 'Avoid ambiguous characters like 0, O, I, 1, l (default: false).' },
    { name: 'unique', type: 'boolean', required: false, desc: 'Require unique characters (default: false).' },
    { name: 'weighted', type: 'boolean', required: false, desc: 'Distribute characters equally across selected pools (default: false).' }
  ],
  payloadTemplate: {
    length: 16,
    num: 1,
    lowercase: true,
    uppercase: true,
    digits: true,
    basicsymbol: true,
    moresymbol: false,
    skipsimilar: false,
    unique: false,
    weighted: false
  }
};

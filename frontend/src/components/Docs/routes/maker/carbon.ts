import type { DocTopic } from '../../types';

export const carbonRoute: DocTopic = {
  id: 'carbon',
  title: 'Carbon Code Image',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/carbon',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate beautiful carbon code images from code snippets with custom syntax highlighting, themes, background colors, and typography.',
  parameters: [
    { name: 'code', type: 'textarea', required: false, desc: 'The source code snippet to render. Defaults to Python print statement.' },
    { 
      name: 'theme', 
      type: 'select', 
      required: false, 
      desc: 'Syntax highlighting theme. Defaults to "monokai".',
      options: [
        '3024-night', 'a11y-dark', 'blackboard', 'base16-dark', 'base16-light', 
        'cobalt', 'dracula', 'duotone-dark', 'hopscotch', 'lucario', 
        'material', 'monokai', 'night-owl', 'nord', 'oceanic-next', 
        'one-dark', 'one-light', 'panda-syntax', 'paraiso-dark', 'seti', 
        'shades-of-purple', 'solarized-dark', 'solarized-light', 'synthwave-84', 
        'twilight', 'verminal', 'vscode', 'yeti', 'zenburn'
      ]
    },
    { 
      name: 'language', 
      type: 'select', 
      required: false, 
      desc: 'Language for highlighting. Defaults to "auto".',
      options: [
        'auto', 'apache', 'bash', 'c', 'c++', 'c#', 'clojure', 'cobol', 
        'coffeescript', 'crystal', 'css', 'd', 'dart', 'diff', 'dockerfile', 
        'elixir', 'elm', 'erlang', 'fortran', 'f#', 'gherkin', 'go', 
        'graphql', 'groovy', 'haskell', 'html', 'http', 'java', 'javascript', 
        'json', 'julia', 'kotlin', 'latex', 'lisp', 'lua', 'markdown', 
        'matlab', 'nginx', 'objective-c', 'ocaml', 'pascal', 'perl', 'php', 
        'powershell', 'python', 'r', 'ruby', 'rust', 'scala', 'scheme', 
        'sql', 'swift', 'toml', 'typescript', 'vb.net', 'xml', 'yaml'
      ]
    },
    { name: 'backgroundColor', type: 'text', required: false, desc: 'Background wrapper color as hex or rgba string. Defaults to "rgba(171, 184, 195, 1)".' },
    { 
      name: 'lineNumbers', 
      type: 'select', 
      required: false, 
      desc: 'Whether to show line numbers (true/false). Defaults to "true".',
      options: ['true', 'false']
    },
    { 
      name: 'windowControls', 
      type: 'select', 
      required: false, 
      desc: 'Whether to show OS window dots (true/false). Defaults to "true".',
      options: ['true', 'false']
    }
  ],
  payloadTemplate: {
    code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))',
    theme: 'monokai',
    language: 'python',
    backgroundColor: 'rgba(171, 184, 195, 1)',
    lineNumbers: 'true',
    windowControls: 'true'
  }
};

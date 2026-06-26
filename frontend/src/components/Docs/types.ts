export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  desc: string;
  options?: string[];
}

export interface DocTopic {
  id: string;
  title: string;
  category: string;
  method?: 'GET' | 'POST';
  path?: string;
  pathTemplate?: string;
  description: string;
  parameters?: Parameter[];
  payloadTemplate?: any;
}

export interface IMakeApiProps {
  method: 'post' | 'get' | 'patch' | 'put' | 'delete' | 'head' | 'options';
  url: string;

  params?: IMakeApiRecord[],
  defaultHeaders?: IMakeApiRecord[],
  defaultBody?: any;

  useDefaultHeader?: boolean;

  theme?: 'dark' | 'light' | string;
}

export interface IMakeApiRecord {
  key: string;
  value: string;
}
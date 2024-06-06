
export interface IOrganization {
  _id: string;
  name: string;
  apiServiceLevel?: string;
  branding?: {
    color: string;
    logo: string;
    fontColor?: string;
    fontFamily?: string;
    contentBackground?: string;
    direction?: 'ltr' | 'rtl';
  };
  defaultLocale?: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
  externalId?: string;
}

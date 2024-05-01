import { ChannelTypeEnum } from '@/types/channel'

export interface IProvider {
  _id: string;

  _environmentId: string;

  _organizationId: string;

  providerId: string;

  channel: ChannelTypeEnum;

  credentials: ICredentials;

  active: boolean;

  name: string;

  identifier: string;

  priority: number;

  primary: boolean;

  deleted: boolean;

  deletedAt: string;

  deletedBy: string;
}

export interface ICreateProviderBodyDto {
  identifier: string;
  providerId: string;
  name: string;
  channel: ChannelTypeEnum;
  credentials?: ICredentials;
  active: boolean;
  check?: boolean;
}

export interface ICredentials {
  apiKey?: string;
  user?: string;
  secretKey?: string;
  domain?: string;
  password?: string;
  host?: string;
  port?: string;
  secure?: boolean;
  region?: string;
  accountSid?: string;
  messageProfileId?: string;
  token?: string;
  from?: string;
  senderName?: string;
  contentType?: string;
  applicationId?: string;
  clientId?: string;
  projectName?: string;
  serviceAccount?: string;
  baseUrl?: string;
  webhookUrl?: string;
  requireTls?: boolean;
  ignoreTls?: boolean;
  tlsOptions?: Record<string, unknown>;
  redirectUrl?: string;
  hmac?: boolean;
  ipPoolName?: string;
  apiKeyRequestHeader?: string;
  secretKeyRequestHeader?: string;
  idPath?: string;
  datePath?: string;
  authenticateByToken?: boolean;
  authenticationTokenKey?: string;
  accessKey?: string;
  instanceId?: string;
  apiToken?: string;
  apiURL?: string;
  appID?: string;
  alertUid?: string;
  title?: string;
  imageUrl?: string;
  state?: string;
  externalLink?: string;
}

export interface IGetProviderRequest {
  providerId?: string;
  channel?: ChannelTypeEnum;
  active?: boolean;
  findOne?: boolean;
}
import {ChannelTypeEnum} from "@/types/channel";
import {BuilderFieldType, BuilderGroupValues} from "@/types/builder.types.ts";
import {ProvidersIdEnum} from "@/providers/provider.enum.ts";
import {IConfigCredentials, ILogoFileName} from "@/providers/provider.interface.ts";

export interface IIntegratedProvider {
  providerId: ProvidersIdEnum;
  integrationId?: string;
  displayName?: string;
  channel?: ChannelTypeEnum;
  hasCredentials?: boolean;
  credentials?: IConfigCredentials[];
  docReference?: string;
  comingSoon?: boolean;
  active?: boolean;
  connected?: boolean;
  conditions?: IConditions[];
  logoFileName?: ILogoFileName;
  betaVersion?: boolean;
  novu?: boolean;
  environmentId?: string;
  name?: string;
  identifier?: string;
  primary?: boolean;
}

export interface IConditions {
  isNegated?: boolean;
  type?: BuilderFieldType;
  value?: BuilderGroupValues;
  children?: any[];
}

export interface IPageResponse<T> {
  page: number,
  pageSize: number,
  totalCount?: number,
  total?: number,
  data: T[]
}

export interface IPageRequest {
  page: number;
  limit: number;
}

export const pageDefault: IPageResponse<any> = {
  page: 0,
  pageSize: 0,
  total: 0,
  data: []
}
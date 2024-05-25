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
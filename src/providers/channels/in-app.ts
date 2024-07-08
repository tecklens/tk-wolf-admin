
import {InAppProviderIdEnum} from '../provider.enum';
import {IProviderConfig} from '../provider.interface.ts';
import {ChannelTypeEnum, UTM_CAMPAIGN_QUERY_PARAM} from "@/types/channel";
import {novuInAppConfig} from "@/providers/credentials/provider-credentials.ts";


export const inAppProviders: IProviderConfig[] = [
  {
    id: InAppProviderIdEnum.Novu,
    displayName: 'Novu In-App',
    channel: ChannelTypeEnum.IN_APP,
    credentials: novuInAppConfig,
    docReference: `https://docs.wolfx.app/notification-center/introduction${UTM_CAMPAIGN_QUERY_PARAM}`,
    logoFileName: {light: 'novu.png', dark: 'novu.png'},
  },
];

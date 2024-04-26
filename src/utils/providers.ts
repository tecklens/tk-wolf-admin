import {ChannelTypeEnum} from "@/types/channel";
import {IIntegratedProvider} from "@/types";
import {emailProviders} from "@/providers/channels/email.ts";
import {smsProviders} from "@/providers/channels/sms.ts";
import {pushProviders} from "@/providers/channels/push.ts";
import {inAppProviders} from "@/providers/channels/in-app.ts";
import {chatProviders} from "@/providers/channels/chat.ts";
import {IProviderConfig} from "@/providers/provider.interface.ts";

const mapStructure = (listProv: any): IIntegratedProvider[] =>
  listProv.map((providerItem: any) => ({
    providerId: providerItem.id,
    displayName: providerItem.displayName,
    channel: providerItem.channel,
    docReference: providerItem.docReference,
    credentials: providerItem.credentials,
  }));

const initialEmailProviders = emailProviders;
const initialSmsProviders = smsProviders;

export const initialProvidersList = {
  [ChannelTypeEnum.EMAIL]: mapStructure(initialEmailProviders),
  [ChannelTypeEnum.SMS]: mapStructure(initialSmsProviders),
  [ChannelTypeEnum.PUSH]: mapStructure(pushProviders),
  [ChannelTypeEnum.IN_APP]: mapStructure(inAppProviders),
  [ChannelTypeEnum.CHAT]: mapStructure(chatProviders),
};

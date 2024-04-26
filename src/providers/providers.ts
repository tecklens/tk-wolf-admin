import { IProviderConfig } from './provider.interface';
import {emailProviders} from "@/providers/channels/email.ts";
import {smsProviders} from "@/providers/channels/sms.ts";
import {chatProviders} from "@/providers/channels/chat.ts";
import {pushProviders} from "@/providers/channels/push.ts";
import {inAppProviders} from "@/providers/channels/in-app.ts";

export const providers: IProviderConfig[] = [
  ...emailProviders,
  ...smsProviders,
  ...chatProviders,
  ...pushProviders,
  ...inAppProviders,
];

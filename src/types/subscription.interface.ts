export interface ISubscription {
  _id?: string;
  channelId: string;
  _userId: string;

  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
  overrides?: any;
  isOnline?: boolean;

  subscribed_at: Date;
  createdAt?: Date;
  createdBy?: string;

  channelName?: string;
}
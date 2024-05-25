export interface IWolfNotificationProps {
  theme?: 'dark' | 'light' | string;
}

export interface INotification {
  _id: string;
  payload: {
    title: string;
    description: string;
  }
  type: string;
  createdAt: string;
  marked: boolean;
}

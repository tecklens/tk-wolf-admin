export interface NodeDataInterface {
  connected: boolean,
  _providerId: string;
  _workflowId: string;
  subject: string;
  sender: string;
  design: any;
  designHtml: string;
  onDelete: (id: string) => void
  delayTime?: number;
  period?: number;

  // * webhook
  webhookUrl?: string;
  method?: string;

  //  * sms
  content?: string;
}
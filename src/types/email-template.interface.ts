export interface IEmailTemplate {
  _id: string;
  _userId?: string;

  name: string;
  preview: string;
  design?: any;
  deletedAt?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IWorkflowEntity {
  _id: string;

  _organizationId: string;

  _environmentId: string;
  _userId: string;

  active: boolean;
  name: string;
  identifier: string;
  description: string;
  tags: string[];

  deleted: boolean;

  deletedAt?: string;

  deletedBy?: string;

  createdAt: string;

  updatedAt?: string;
}
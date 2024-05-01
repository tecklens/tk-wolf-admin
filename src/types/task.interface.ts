export interface ITask {
  id?: string;

  _workflowId: string;
  workflowName: string;
  _nodeId: string;
  _providerId: string;
  providerName: string;
  payload: any;
  channel: string;

  code: string;
  name: string;
  type: string;
  status: TaskStatus;
  priority: string;
  subscriberId: string;
  email: string;

  deletedAt?: string;
  deletedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export enum TaskStatus {
  todo,
  backlog,
  in_process,
  cancel,
  done,
}
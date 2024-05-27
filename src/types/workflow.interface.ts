import { Node as NodeFlow, Edge as EdgeFlow, Viewport } from 'reactflow'

export interface INode extends NodeFlow {
  _id: string;
  _providerId: string;
}

export type IEdge = EdgeFlow & {
  _id: string;
}

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

  nodes: INode[];
  edges: IEdge[];

  viewport: Viewport;
}

export interface IUpdateWorkflow {
  workflowId: string;
  name: string;
  description?: string;
  tags?: string[] | null
}

export interface IVariable {
  _id?: string;
  _workflowId: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  defaultValue?: any;
  name?: string;
  isDefault: boolean;

  createdAt: string;
  updatedAt?: string;
}

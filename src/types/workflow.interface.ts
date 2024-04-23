import {Node as NodeFlow, Edge as EdgeFlow} from 'reactflow'

export interface INode extends NodeFlow {
  _id: string;
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
}
export interface NodeDataInterface {
  connected: boolean,
  _providerId: string;
  _workflowId: string;
  onDelete : (id: string) => void
}
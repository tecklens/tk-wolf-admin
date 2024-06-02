import { IObject } from "@daybrush/utils";

export type RestoreCallback = (props: any) => any;
export interface HistoryAction {
  type: string;
  props: IObject<any>;
}
export default class HistoryManager {
  private undoStack: HistoryAction[] = [];
  private redoStack: HistoryAction[] = [];
  private types: IObject<{ redo: RestoreCallback, undo: RestoreCallback }> = {};
  constructor() { }
  public registerType(type: string, undo: RestoreCallback, redo: RestoreCallback) {
    this.types[type] = { undo, redo };
  }
  public addAction(type: string, props: IObject<any>) {
    this.undoStack.push({
      type,
      props,
    });
    this.redoStack = [];
  }
  public undo() {
    const undoAction = this.undoStack.pop();

    if (!undoAction) {
      return;
    }
    this.types[undoAction.type].undo(undoAction.props);
    this.redoStack.push(undoAction);
  }
  public redo() {
    const redoAction = this.redoStack.pop();

    if (!redoAction) {
      return;
    }
    this.types[redoAction.type].redo(redoAction.props);
    this.undoStack.push(redoAction);
  }
}

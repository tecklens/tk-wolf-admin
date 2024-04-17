import { create } from 'zustand'

export interface NodeState {
  node: any;
  nodeChanging: any;
  select: (node: any) => any;
  updateNodeChanging: (node: any) => any;
}

export const useNode = create<NodeState>((set) => ({
  node: null,
  nodeChanging: null,
  select: (node) => set(() => {
    return { node }
  }),
  updateNodeChanging: (node) => set(() => {
    return { nodeChanging: node }
  }),
}))
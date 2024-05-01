import { create } from 'zustand'

export interface NodeState {
  node: any;
  nodeChanging: any;
  emailEdit: {
    open: boolean;
    data: any;
  };
  openEmailEdit: (d: {
    open: boolean;
    data: any;
  }) => void,
  select: (node: any) => any;
  updateNodeChanging: (node: any) => any;
}

export const useNode = create<NodeState>((set) => ({
  node: null,
  emailEdit: {
    open: false,
    data: null
  },
  nodeChanging: null,
  select: (node) => set(() => {
    return { node }
  }),
  updateNodeChanging: (node) => set(() => {
    return { nodeChanging: node }
  }),
  openEmailEdit: (d: {
    open: boolean;
    data: any;
  }) => set({emailEdit: d})
}))
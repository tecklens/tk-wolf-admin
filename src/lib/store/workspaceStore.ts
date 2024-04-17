import { create } from 'zustand'

export const useWorkspaceSelected = create((set) => ({
  workspace: null,
  select: (workspace: any) => set(() => {
    return { workspace }
  }),
}))
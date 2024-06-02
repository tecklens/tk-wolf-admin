import { create } from 'zustand'
import Memory from '@/components/moveable/Memory.ts'
import MoveableData from '@/components/moveable/MoveableData.tsx'
import EventBus from '@/components/moveable/EventBus.ts'
import HistoryManager from '@/components/moveable/HistoryManager.ts'

export interface LayoutState {
  selectedMenu: string,
  setSelectedMenu: (m: string) => void,
  memory: Memory,
  moveableData: MoveableData
  eventBus: EventBus,
  historyManager: HistoryManager,
}

export const useLayout = create<LayoutState>((set) => {
  const m = new Memory()
  return {
    selectedMenu: 'MoveTool',
    memory: m,
    eventBus: new EventBus(),
    historyManager: new HistoryManager(),
    moveableData: new MoveableData(m),
    setSelectedMenu: async (s: string) => {
      set({
        selectedMenu: s,
      })
    },
  }
});
import { create } from 'zustand'
import { ReadyState } from 'react-use-websocket'

const colorList = {
  [ReadyState.CONNECTING]:
    '#00bde3',
  [ReadyState.OPEN]:
    '#00a91c',
  [ReadyState.CLOSING]:
    '#b50909',
  [ReadyState.CLOSED]:
    '#b50909',
  [ReadyState.UNINSTANTIATED]:
    '#e5a000',
}

const labelList = {
  [ReadyState.CONNECTING]:
    'Connecting',
  [ReadyState.OPEN]:
    'Open',
  [ReadyState.CLOSING]:
    'Closing',
  [ReadyState.CLOSED]:
    'Closed',
  [ReadyState.UNINSTANTIATED]:
    'Uninstantiated',
}

export interface IWs {
  status: ReadyState | null,
  listWs: [],
  update: (status: ReadyState) => void
  getStatus: (status: ReadyState) => {color: string;label:string}
}

export const useWsStore = create<IWs>((set) => ({
  status: null,
  listWs: [],
  update: (status: ReadyState) => set(() => ({ status })),
  getStatus: (status: ReadyState) => {
    return {
      color: colorList[status],
      label: labelList[status],
    }
  },
}))
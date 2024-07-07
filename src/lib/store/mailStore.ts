import { create } from 'zustand'


export interface MailState {
  mail: any;
  setMail: (p: any) => void

}

export const useMail = create<MailState>((set) => ({
  mail: null,
  setMail: (p: any) => set({mail: p})
}))
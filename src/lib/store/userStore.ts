import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initState = {
  userId: null,
  username: '',
  user: null,
}

export const useUser = create(
  persist((set) => ({
    ...initState,
    update: (user: any) => set(() => {
      return { user, username: user?.username, userId: user?.id }
    }),
    reset: () => {
      set(initState)
    }
  }),
    {
      name: 'user'
    }
  )
)
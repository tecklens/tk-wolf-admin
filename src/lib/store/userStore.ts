import { create } from 'zustand'
import { IUser } from '@/types/IUser.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const AuthRepository = RepositoryFactory.get('auth')
const UserRepository = RepositoryFactory.get('user')

export interface IUserStore {
  user: IUser | null;
  signIn: (user: IUser) => Promise<boolean>
  updateUser: (user: IUser) => void
}

const initState = {
  user: null
}

export const useUser = create<IUserStore>(
  (set) => ({
    ...initState,
    signIn: async (user: IUser) => {
      const rsp = await AuthRepository.login(user)

      if (rsp.data?.token) {

        localStorage.setItem('token', rsp.data?.token)
        const info = await UserRepository.getInfoMe()
        set({
          user: info.data,
        })

        return true
      }

      return false
    },
    updateUser: (user:IUser) => set({user})
  })
)
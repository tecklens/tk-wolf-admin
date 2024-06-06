import {create} from 'zustand'
import {UserInterface} from '@/types/user.interface.ts'
import {RepositoryFactory} from '@/api/repository-factory.ts'
import {HttpStatusCode} from "axios";
import {useToastGlobal} from "@/lib/store/toastStore.ts";
import {useEnv} from "@/lib/store/envStore.ts";
import { IOrganization } from '@/types/organization.interface.ts'

const AuthRepository = RepositoryFactory.get('auth')
const UserRepository = RepositoryFactory.get('user')

export interface IUserStore {
  user: UserInterface | null;
  token: string | undefined;
  signIn: (user: UserInterface) => Promise<boolean>
  organizations: IOrganization[];
  currentOrg: string | undefined;
  fetchOrg: () => void
  updateCurrentOrg: (orgId: string) => void
  updateUser: () => void
  sendUpdate: (user: UserInterface) => void
  switchEnv: (envId: string) => void
  setToken: (token: string) => void
}

const initState = {
  user: null,
  token: localStorage.getItem("token") ?? undefined,
  organizations: [],
  currentOrg: undefined
}

export const useUser = create<IUserStore>(
  (set, getState) => ({
    ...initState,
    signIn: async (user: UserInterface) => {
      const rsp = await AuthRepository.login(user)

      if (rsp.data?.token) {

        localStorage.setItem('token', rsp.data?.token)

        return true
      }

      return false
    },
    updateUser: async () => {
      const info = await UserRepository.getInfoMe()
      useEnv.getState().fetchEnv()
      useEnv.getState().fetchAllEnv()
      set({user: info.data})
    },
    sendUpdate: async (user: UserInterface) => {
      const rsp = await UserRepository.update(user)

      if (rsp.status === HttpStatusCode.Ok) {
        set({
          user: rsp.data
        })
        useToastGlobal.getState().update({
          title: 'Update user',
          description: 'Update user info successful',
          variant: 'default'
        })
      } else {
        useToastGlobal.getState().update({
          title: 'Update user',
          description: 'Update info failed',
          variant: 'destructive'
        })
      }
    },
    switchEnv: async (envId: string) => {
      const rspToken = await AuthRepository.switchEnv(envId)

      localStorage.setItem('token', rspToken.data?.token)
      getState().setToken(rspToken.data?.token)
    },
    setToken: async (token) => {
      set({
        token: token
      })

      if (token && token.length > 128) {
        localStorage.setItem('token', token);
        getState().updateUser()
      } else {
        localStorage.removeItem('token')
      }
    },
    fetchOrg: async () => {
      const rsp = await UserRepository.organizations()
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          organizations: rsp.data
        })
      }
    },

    updateCurrentOrg: (orgId: string) => {
      set({
        currentOrg: orgId
      })
    }
  })
)
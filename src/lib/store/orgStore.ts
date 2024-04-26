import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
const OrgRepository = RepositoryFactory.get('org')

export interface OrgState {
  members: any[];
  fetchMembers: () => void;
}

export const useOrg = create<OrgState>((set) => ({
  members: [],
  fetchMembers: async () => {
    const rsp = await OrgRepository.members();

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        members: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get Members of Organization failed'
      })
    }
  }
}))
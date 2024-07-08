import {create} from 'zustand'
import {RepositoryFactory} from '@/api/repository-factory.ts'
import {AxiosError, AxiosResponse, HttpStatusCode} from 'axios'
import {useToastGlobal} from '@/lib/store/toastStore.ts'

const OrgRepository = RepositoryFactory.get('org')
const FileRepository = RepositoryFactory.get('file')

export interface OrgState {
  members: any[];
  fetchMembers: () => void;
  updateBrand: (payload: { logo?: File | string | undefined, color?: string, font?: string }) => void;
  brand: any;
  fetchBrand: () => void;
}

export const useOrg = create<OrgState>((set) => ({
  brand: null,
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
  },
  updateBrand: async (payload: { logo?: File | string | undefined, color?: string, font?: string }) => {
    let logoUrl = null;
    if (payload.logo && typeof payload.logo != 'string') {
      const uploadResp = await FileRepository.uploadFile(payload.logo)
      if (uploadResp.status == HttpStatusCode.Created) {
        logoUrl = uploadResp.data
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'File upload failed',
        })
      }
    } else {
      logoUrl = payload.logo
    }

    OrgRepository.updateBrand({
      ...payload,
      logo: logoUrl
    }).then((updateBrandResp: AxiosResponse) => {
      if (updateBrandResp.status === HttpStatusCode.Ok) {
        useToastGlobal.getState().update({
          variant: 'default',
          title: 'Update brand successful',
        })
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'Updating the organization\'s brand failed',
        })
      }
    }).catch((e: AxiosError) => {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: e.message,
      })
    })
  },
  fetchBrand: async () => {
    OrgRepository.getBrand().then((rsp: AxiosResponse) => {
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          brand: rsp.data
        })
      }
    })
  }
}))
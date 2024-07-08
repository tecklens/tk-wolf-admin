import BaseRepository from '@/api/base-repository.ts'
import { UserInterface } from '@/types/user.interface.ts'

const resource = '/org'

export default {
  members() {
    return BaseRepository.get(`${resource}/members`)
  },
  delMember(id: string) {
    return BaseRepository.delete(`${resource}/member/${id}`)
  },
  inviteMembers(payload: any) {
    return BaseRepository.post(`${resource}/invite`, payload)
  },
  resendInviteMembers(payload: any) {
    return BaseRepository.post(`${resource}/invite/resend`, payload)
  },
  getInviteData(token: string) {
    return BaseRepository.get(`${resource}/invite/${token}`)
  },
  acceptInvite(token: string) {
    return BaseRepository.post(`${resource}/invite/${token}/accept`)
  },
  updateBrand(payload: any) {
    return BaseRepository.put(`${resource}/brand`, payload)
  },
  getBrand() {
    return BaseRepository.get(`${resource}/brand`)
  },
}
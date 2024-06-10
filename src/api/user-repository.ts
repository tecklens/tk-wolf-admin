import BaseRepository from '@/api/base-repository.ts'
import {UserInterface} from "@/types/user.interface.ts";

const resource = '/user'

export default {

  getInfoMe() {
    return BaseRepository.get(`${resource}/me`)
  },
  update(payload: UserInterface) {
    return BaseRepository.put(`${resource}/profile`, payload)
  },
  createPaymentIndent(payload: any) {
    return BaseRepository.post(`/payment/create-payment-indent`, payload)
  },
  updateGuide(type: string) {
    return BaseRepository.put(`${resource}/guide/${type}`)
  },
  organizations() {
    return BaseRepository.get(`org`)
  },
  submitBug(payload: any) {
    return BaseRepository.post(`${resource}/bug/submit`, payload)
  }
}
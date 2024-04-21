import BaseRepository from '@/api/base-repository.ts'
import { IUser } from '@/types/IUser.ts'

const resource = '/auth'

export default {
  login(payload: IUser) {
    return BaseRepository.post(`${resource}/login`, payload)
  },
  githubAuth() {
    return BaseRepository.get(`${resource}/github`)
  },
  githubAuthCallback(payload: any) {
    return BaseRepository.get(`${resource}/github/callback`, {
      params: payload,
    })
  },
  sendEmailResetPass(payload: IUser) {
    return BaseRepository.post(`${resource}/reset/request`, payload)
  },
  forgotPass(payload: IUser) {
    return BaseRepository.post(`${resource}/reset`, payload)
  }
}
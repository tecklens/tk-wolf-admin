import { toast } from '@/components/ui/use-toast'
import axios from 'axios'

const BASE_DOMAIN = process.env.REACT_APP_BASE_DOMAIN
export const BASE_URL = `${BASE_DOMAIN}/wolf/v1`

const instance = axios.create({
  baseURL: BASE_URL,
})

export default instance

const errorHandler = (error: any) => {
  toast({
    title: `${error.response.data.message}`,
    draggable: true,
    variant: 'destructive',

  })

  return Promise.reject({ ...error })
}

instance.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null

  return config
})

instance.interceptors.response.use(
  (response) => {

    return response
  },
  async (error) => {
    const originalRequest = error.config
    const serverCallUrl = originalRequest.url
    const status = error.response.status

    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !serverCallUrl?.includes('/login')
    ) {
      // let token = await refreshAccessToken()
      // setAccessToken(token)

      // originalRequest._retry = true
      // originalRequest.headers.authorization = `Bearer ${token}`

      return axios(originalRequest)
    } else return errorHandler(error)
  })
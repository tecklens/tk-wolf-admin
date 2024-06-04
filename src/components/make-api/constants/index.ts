import {IMakeApiRecord} from "../types/api.interface";

export const defaultHeader: IMakeApiRecord[] = [
  {
    key: 'Content-Type',
    value: 'application/json'
  },
  {
    key: 'Accept',
    value: '*/*'
  },
  {
    key: 'Accept-Encoding',
    value: 'gzip, deflate, br'
  },
  {
    key: 'Connection',
    value: 'keep-alive'
  }
]
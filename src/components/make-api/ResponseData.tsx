import { AxiosResponse } from 'axios'
import locale from './lib/ajrm-en'
import JSONInput from 'react-json-editor-ajrm'
import { HttpStatusText } from '@/components/make-api/constants/HttpStatusText.ts'
import { get } from 'lodash'
import { useEffect, useState } from 'react'

export function ResponseData({ data, theme }: {
  data: AxiosResponse | undefined;
  theme: 'dark' | 'light' | undefined | string;
}) {
  const [json, setJson] = useState<any>(null)

  useEffect(() => {
    setJson(data?.data)
  }, [data])

  return (
    <div className={'flex flex-col mt-2 max-w-[100%]'}>
      <div className={'inline-flex justify-between space-x-2'}>
        <div className={`text-sm font-semibold`}>Response</div>
        {data ?
          <div className={'inline-flex text-sm'}>
            <div className={'inline-flex space-x-1'}>
              <div>Status:</div>
              <div className={'text-green-500'}>{data.status} {get(HttpStatusText, data.status)}</div>
            </div>
          </div>
          : null
        }
      </div>
      {json && typeof json !== 'string' ?
        <div className={'w-full border rounded-lg mt-1 overflow-hidden'}>
          <JSONInput
            id="api-response"
            placeholder={json}
            theme={theme === 'dark' ? 'light_mitsuketa_tribute' : 'dark_vscode_tribute'}
            // colors={darktheme}
            locale={locale}
            height="250px"
            width={'100%'}
            viewOnly={true}
            onChange={(e: any, val: any) => {
              console.log(e, val)
            }}
          />
        </div>
        : <div className={'w-full border rounded-lg mt-1 overflow-hidden min-h-[200px]'}>{json}</div>
      }
    </div>
  )
}
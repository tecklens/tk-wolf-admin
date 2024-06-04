import React from 'react'
import { useTheme } from '@/components/theme-provider.tsx'
import { MakeApi } from '@/components/make-api/MakeApi.tsx'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { BASE_DOMAIN } from '@/api/base-repository.ts'
import { defaultHeader } from '@/components/make-api/constants'
import { useEnv } from '@/lib/store/envStore.ts'

export default function MakeApiContainer() {
  const { theme } = useTheme()
  const {workflow} = useWorkflow()
  const apiKey = useEnv(state => state.apiKey)

  return (
    <div className={'py-8'}>
      <MakeApi
        method={'post'}
        url={`${BASE_DOMAIN}/wolf/v1/trigger/`}
        defaultBody={{
          'workflowId': workflow?._id,
          'data': {},
          'target': {
            'subcriberId': 'abc',
            'email': '<target_email>',
            'phone': '<target_phone>',
          },
          'overrides': {
            'from': '<another_field>',
          },
        }}
        defaultHeaders={[
          ...defaultHeader,
          {
            key: 'Authorization',
            value: `ApiKey ${apiKey}`
          }
        ]}
        theme={theme}
      />
    </div>
  )
}
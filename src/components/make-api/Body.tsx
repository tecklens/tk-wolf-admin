import JSONInput from 'react-json-editor-ajrm'
import locale from './lib/ajrm-en'
import { forwardRef } from 'react'

export const Body = forwardRef(({value, theme, onChange}: {value: any; theme: 'dark' | 'light' | undefined | string; onChange: (jsObject: any) => void}, ref: any) => {

  return (
    <div className={'flex flex-col space-y-2'}>
      <div className={'text-sm font-semibold'}>Body</div>
      <div className={'border rounded-lg overflow-hidden'}>
        <JSONInput
          ref={ref}
          id='editor'
          placeholder={typeof value === 'string' ? JSON.parse(value) : value}
          theme={theme === 'dark' ? 'light_mitsuketa_tribute' : 'dark_vscode_tribute'}
          // colors={darktheme}
          locale={locale}
          height='250px'
          width={'100%'}
          onChange={(e: any, val: any) => {
            console.log("change", e)
            console.log(val)
          }}
          onBlur={(e: any)=> {
            onChange(e.json)
          }}
        />
      </div>
    </div>
  )
})
import { useTheme } from '@/components/theme-provider.tsx'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconMessages } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'

export default function SmsNodeInfo() {
  const { theme } = useTheme()
  const {smsEdit, openSmsEdit} = useNode()

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          <div className={'inline-flex space-x-2 items-center p-4'}>
            <IconMessages color={'rgb(244,75,14)'} size={28} />
            <div className={'font-bold text-lg'}>Sms</div>
          </div>
        </SheetTitle>
        {/*<SheetDescription>*/}
        {/*  Make changes to your node of flow here. Click save when you're done.*/}
        {/*</SheetDescription>*/}
      </SheetHeader>
      <div
        className={`p-3 flex flex-col space-y-3 my-3`}>
        <Button onClick={() => {
          openSmsEdit({
            open: true,
            data: {}
          })
        }}>Edit Message</Button>
        <div className={'font-semibold text-lg'}>Preview</div>
        <div className={'border-2 rounded-lg p-3'}>
          <div className={'flex flex-col h-full justify-end items-end'}>
            <div className={'bg-slate-200 rounded-xl px-4 py-2'}>
              <span>AIO: Quy khach nhap ma OTP 123456 de dang nhap tai khoan tren ung dung AIO</span>
            </div>
            <div className={'text-xs text-slate-700 pr-3'}>14:50</div>
          </div>
        </div>
      </div>
      <div className={'p-4'}>
      </div>
    </>
  )
}
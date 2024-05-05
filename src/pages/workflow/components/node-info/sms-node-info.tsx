import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconMailBolt, IconMessages } from '@tabler/icons-react'
import DeviceEmulator from 'react-device-emulator'
import 'react-device-emulator/lib/styles/style.css'
import { Button } from '@/components/custom/button.tsx'

export default function SmsNodeInfo({ onClose, reloadNode }: { onClose: () => void, reloadNode: () => void }) {
  const { theme } = useTheme()

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
        className={`flex flex-col space-y-3 my-3 items-center`}>
        {/*@ts-ignore*/}
        <DeviceEmulator withDeviceSwitch={false} withRotator={false} withoutChrome={true}>
          <div className={'flex flex-col h-full justify-end'}>
            <div className={'bg-slate-200 rounded-lg px-4 py-2'}>
              <span>AIO: Quy khach nhap ma OTP 123456 de dang nhap tai khoan tren ung dung AIO</span>
            </div>
            <div>14:50</div>
          </div>
        </DeviceEmulator>
      </div>
      <div className={'p-4'}>
      </div>
    </>
  )
}
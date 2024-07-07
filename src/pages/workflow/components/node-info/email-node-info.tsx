import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconMailBolt } from '@tabler/icons-react'
import DeviceEmulator from 'react-device-emulator'
import 'react-device-emulator/lib/styles/style.css'
import { Button } from '@/components/custom/button.tsx'

export default function EmailNodeInfo({ designHtml }: { designHtml: string }) {
  const { theme } = useTheme()
  const openEmailEdit = useNode(state => state.openEmailEdit)

  return (
    <div className={'overflwo-y-auto'}>
      <SheetHeader>
        <SheetTitle>
          <div className={'inline-flex space-x-2 items-center p-4'}>
            <IconMailBolt color={'rgb(244,75,14)'} size={28} />
            <div className={'font-bold text-lg'}>Email</div>
          </div>
        </SheetTitle>
        {/*<SheetDescription>*/}
        {/*  Make changes to your node of flow here. Click save when you're done.*/}
        {/*</SheetDescription>*/}
      </SheetHeader>
      <div className={'p-4 mb-10'}>
        <Button onClick={() => {
          openEmailEdit({
            open: true,
            data: null,
          })
        }}>Edit Message</Button>
      </div>
      <div
        className={`flex flex-col space-y-3 my-3 items-center`}>
        {/*@ts-ignore*/}
        <DeviceEmulator withDeviceSwitch={false} withRotator={false} withoutChrome={true}>
          <div dangerouslySetInnerHTML={{ __html: designHtml }}></div>
        </DeviceEmulator>
      </div>
    </div>
  )
}
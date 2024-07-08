import { useTheme } from '@/components/theme-provider.tsx'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconMessages, IconSend } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

interface IMessageNodeInfoProps {
  content: {
    source: string;
    plainText: string;
  };
}

export default function MessageNodeInfo({content}: IMessageNodeInfoProps) {
  const {openSmsEdit} = useNode()
  const {theme} = useTheme()

  const parseContent = useCallback(() => {
    return content?.plainText ?? '...'
  }, [content])

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          <div className={'inline-flex space-x-2 items-center p-4'}>
            <IconMessages color={'rgb(244,75,14)'} size={28}/>
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
            data: content,
          })
        }}>Edit Message</Button>
        <div className={'font-semibold text-lg'}>Preview</div>
        <div className={'border-2 rounded-lg p-3 w-[320px]'}>
          <div className={'flex flex-col h-full justify-end items-end space-y-1'}>
            <div className={'flex space-x-2 items-end'}>
              <div className={'flex flex-col items-start'}>
                <span className={'text-xs ml-1 text-gray-500'}>Your App</span>
                <div className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'} rounded-xl px-4 py-2 text-sm`}>
                  <span>{parseContent()}</span>
                </div>
              </div>
              <Avatar className="h-6 w-6">
                <AvatarImage src={''} alt="@shadcn"/>
                <AvatarFallback className={'text-xs'}>SN</AvatarFallback>
              </Avatar>
            </div>
            <div className={'text-xs text-slate-700'}>14:50</div>
            <div className={'w-full inline-flex space-x-2 items-center'}>
              <div
                className={`w-full flex-1 px-2 py-1 rounded-full text-sm text-gray-600 ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'}`}>
                <span>Message</span>
              </div>
              <IconSend className={'text-blue-500'} size={18}/>
            </div>
          </div>
        </div>
      </div>
      <div className={'p-4'}>

      </div>
    </>
  )
}
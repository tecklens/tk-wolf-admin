import './node-info.css'
import {useNode} from '@/lib/store/nodeStore.ts'
import WebhookNodeInfo from '@/pages/workflow/components/node-info/webhook-node-info.tsx'
import {SheetClose, SheetFooter} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/custom/button.tsx";

export default function NodeInfo() {
  const {node} = useNode((state) => state)

  return (
    <div className={'h-full flex flex-col'}>
      {node?.type === 'webhook'
        ? <WebhookNodeInfo/>
        : null}
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </div>
  )
}
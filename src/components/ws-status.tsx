import {memo} from "react";
import {useWsStore} from "@/lib/store/wsStore.ts";
import {ReadyState} from "react-use-websocket";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export const WsStatus = memo(() => {
  const {getStatus, status} = useWsStore()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div style={{color: getStatus(status ?? ReadyState.CONNECTING).color}}
             className={'inline-flex space-x-2 items-center '}>
        <span className='relative flex h-3 w-3'>
          <span
            className='animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 duration-700'
            style={{backgroundColor: getStatus(status ?? ReadyState.CONNECTING).color}}
          />
          <span
            className='relative inline-flex rounded-full h-3 w-3'
            style={{backgroundColor: getStatus(status ?? ReadyState.CONNECTING).color}}
          ></span>
        </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Status of Websocket</p>
      </TooltipContent>
    </Tooltip>
  )
})
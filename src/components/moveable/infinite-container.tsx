import InfiniteViewer from 'react-infinite-viewer'
import React, { Ref, useState } from 'react'
import { prefix } from '@/components/moveable/utils.ts'
import Viewport from './Viewport'
import Selecto from 'react-selecto'

const InfiniteContainer = React.forwardRef<InfiniteViewer, {
  children: React.ReactNode,
  viewport: Ref<Viewport>,
}>((props, ref: Ref<InfiniteViewer>) => {
  const [zoom, setZoom] = useState(1)

  return (
    <InfiniteViewer
      ref={ref}
      className="viewer h-full relative"
      margin={0}
      zoom={zoom}
      threshold={0}
      rangeX={[0, 0]}
      rangeY={[0, 0]}
      onScroll={e => {
        console.log(e);
      }}
    >
      <div className={'h-full relative'}>
        {props.children}
      </div>
    </InfiniteViewer>
  )
})

export default InfiniteContainer
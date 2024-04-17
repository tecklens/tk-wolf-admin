import {memo} from 'react'
import {Handle, Position} from 'reactflow'
import {IconHeart} from "@tabler/icons-react";

// eslint-disable-next-line react-refresh/only-export-components
export default memo(({ isConnectable }: {isConnectable: boolean }) => {

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-xl w-[200px] hover:shadow-cyan-300/50 hover:shadow-lg border-2`}
      >
        <div className={'flex flex-col space-y-2 divide-y'}>
          <div className={'inline-flex space-x-2 items-center px-4 pt-2'}>
            <IconHeart size={28}/>
          </div>
          <div className={'flex flex-col px-4 py-2 text-sm'}>
            <span>baohanh.aiosmart.com.vn</span>
          </div>
        </div>
        <Handle
          type='source'
          id='red'
          position={Position.Right}
          className={'w-3 h-3 -right-2 !bg-teal-500 handle-inner'}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        {/*<Handle*/}
        {/*  type='target'*/}
        {/*  position={Position.Left}*/}
        {/*  id='blue'*/}
        {/*  className={'w-3 h-3 -left-2 !bg-blue-500 handle-inner'}*/}
        {/*  isConnectable={isConnectable}*/}
        {/*/>*/}
      </div>
    </>
  )
})

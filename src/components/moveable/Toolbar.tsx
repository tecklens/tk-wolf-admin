import {
  IconCircle,
  IconCrop,
  IconHandGrab,
  IconLetterCase,
  IconLockOpen,
  IconPhotoEdit,
  IconRectangle,
  IconSquareRotated,
} from '@tabler/icons-react'
import React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useLayout } from '@/lib/store/layoutStore.ts'
import Memory from '@/components/moveable/Memory.ts'

export const toolbars = [
  {
    icon: <IconLockOpen size={18} />,
    maker: null,
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 1,
    value: 'Lock'
  },
  {
    icon: <IconHandGrab size={18} />,
    maker: null,
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 2,
    value: 'MoveTool'
  },
  {
    icon: <IconRectangle size={18} />,
    maker: (memory: Memory) => ({
      tag: "div",
      attrs: {},
      style: {
        "background-color": memory.get("background-color"),
        "border-radius": "10px",
        "position": "absolute"
      },
    }),
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 3,
    value: 'RoundRect'
  },
  {
    icon: <IconCircle size={18} />,
    maker: (memory: Memory) => ({
      tag: "div",
      attrs: {},
      style: {
        "background-color": memory.get("background-color"),
        "border-radius": "50%",
      },
    }),
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 4,
    value: 'Oval'
  },
  {
    icon: <IconSquareRotated size={18} />,
    maker: null,
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 5,
    value: 'Eclipse'
  },
  {
    icon: <IconLetterCase size={18} />,
    maker: (memory: Memory) => ({
      tag: "div",
      attrs: {
        contenteditable: true,
      },
      style: {
        color: memory.get("color"),
      },
    }),
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 6,
    value: 'Text'
  },
  {
    icon: <IconCrop size={18} />,
    maker: null,
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 7,
    value: 'Crop'
  },
  {
    icon: <IconPhotoEdit size={18} />,
    maker: null,
    shortcut: 'ctrl+l',
    title: 'Lock pane',
    id: 8,
    value: 'Image'
  },
]
export default function LayoutToolbar() {
  const {selectedMenu, setSelectedMenu} = useLayout()

  useHotkeys('ctrl+1', () => {
    console.log('event k')
  }, { scopes: ['settings'] })

  return (

    <div className={`tool-container p-0.5 inline-flex space-x-1`}>

      {toolbars.map(e => (
        <div
          key={e.id}
          onClick={() => setSelectedMenu(e.value)}
          className={`h-9 aspect-square flex items-center justify-center p-2 rounded-lg 
          ${selectedMenu === e.value ? 'text-[#030064] bg-[#e0dfff]' : 'hover:bg-[#f1f0ff]'}`}>
          {e.icon}
        </div>
      ))}
    </div>
  )
}
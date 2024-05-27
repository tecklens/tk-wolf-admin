import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import React from 'react'

export interface IWrapperNodeProps {
  children: React.ReactNode;
  onDelete: () => void,
  disableMenu?: string[] | undefined
  openProvider?: () => void
  openSetting: () => void
  reloadNode: () => void
}

export function WrapperNode({
                              children,
                              onDelete,
                              disableMenu = [],
                              openProvider = () => {
                              },
                              openSetting,
                              reloadNode,
                            }: IWrapperNodeProps) {

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64" onClick={e => e.stopPropagation()}>
        <ContextMenuItem inset onClick={openSetting}>
          Setting
          <ContextMenuShortcut>⌘+Shift+S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={reloadNode}>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="config">
          <ContextMenuLabel inset>Config</ContextMenuLabel>
          <ContextMenuSeparator />
          {disableMenu?.includes('change-provider') ? null
            : <ContextMenuRadioItem value="change-provider" onClick={openProvider}>
              Change Provider
            </ContextMenuRadioItem>}
          <ContextMenuRadioItem value="delete" onClick={onDelete}>Delete</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
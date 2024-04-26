import {Search} from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import {UserNav} from '@/components/user-nav'
import {Layout, LayoutBody, LayoutHeader} from '@/components/custom/layout'
import {DataTable} from './components/data-table'
import {columns} from './components/columns'
import {tasks} from './data/tasks'
import {WsStatus} from "@/components/ws-status.tsx";
import {IconMailBolt, IconPlus} from "@tabler/icons-react";
import {Button} from "@/components/custom/button.tsx";
import {initialProvidersList} from "@/utils/providers.ts";
import {useState} from "react";
import {IIntegratedProvider} from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {useTheme} from "@/components/theme-provider.tsx";
import UpdateProvider from "@/pages/provider/components/update-provider.tsx";

export default function Providers() {
  const [providersList, setProvidersList] = useState(initialProvidersList);
  console.log(initialProvidersList)
  const [selectedProvider, setSelectedProvider] = useState<IIntegratedProvider | null>(null);
  const [openSelect, setOpenSelect] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const {theme} = useTheme()

  function getLogoFileName(providerId: string) {
    return `/images/providers/${theme}/square/${providerId}.svg`;
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search/>
        <div className='ml-auto flex items-center space-x-4'>
          <WsStatus/>
          <ThemeSwitch/>
          <UserNav/>
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Provider integration another system</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>

          <div>
            <Dialog open={openSelect} onOpenChange={(val) => setOpenSelect(val)}>
              <DialogTrigger asChild>
                <Button><IconPlus/> Provider</Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <Command className="rounded-lg border shadow-md">
                  <CommandInput placeholder="Type a command or search..."/>
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {Object.entries(providersList).map(([key, value]) => (
                      <div className={'flex flex-col'} key={key}>
                        <CommandGroup heading={key} className={'capitalize'}>
                          {value.map(v => (
                            <CommandItem key={v.providerId} className={'inline-flex space-x-2 w-full'}
                                         onSelect={(vItem) => {
                                           console.log(v)
                                           console.log('selected provider: ', vItem)
                                           setSelectedProvider(v)
                                           setOpenSelect(false)
                                           setOpenEdit(true)
                                         }}>
                              <img src={getLogoFileName(v.providerId)} alt={'logo provider'} className={'h-4 w-4'}/>
                              <span>{v.displayName}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandSeparator/>
                      </div>
                    ))}
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>
            <Dialog open={openEdit} onOpenChange={(val) => setOpenEdit(val)}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle className={'inline-flex space-x-2'}>
                    {selectedProvider?.providerId
                      ? <img src={getLogoFileName(selectedProvider?.providerId)} alt={'logo provider'}
                             className={'h-6 w-6'}/>
                      : null
                    }
                    <div>{selectedProvider?.displayName}</div>
                  </DialogTitle>
                  <DialogDescription>
                    {/*<Badge variant='outline'>*/}
                    {/*  {selectedProvider?.channel}*/}
                    {/*</Badge>*/}
                    <div className={'border border-slate-400 px-2 rounded w-fit inline-flex items-center space-x-1'}>
                      <IconMailBolt size={12}/>
                      <div className={'mb-0.5'}>{selectedProvider?.channel}</div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <UpdateProvider selected={selectedProvider}/>
                <DialogFooter>
                  <Button type="button" onClick={() => setOpenEdit(false)} variant={'destructive'}>Cancel</Button>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasks} columns={columns}/>
        </div>
      </LayoutBody>
    </Layout>
  )
}

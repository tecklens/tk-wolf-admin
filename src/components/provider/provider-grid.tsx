import React, { useEffect, useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import { apps } from './data.tsx'
import { motion } from 'framer-motion'
import { providers } from '@/providers/providers.ts'
import { useTheme } from '@/components/theme-provider.tsx'
import { throttle } from 'lodash'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useNavigate } from 'react-router-dom'

const ProviderRepository = RepositoryFactory.get('provider')

const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function AppsProviderGrid() {
  const navigate = useNavigate()
  const {theme} = useTheme()
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [connected, setConnected] = useState<string[]>([])
  function getLogoFileName(providerId: string) {
    return `/images/providers/${theme}/square/${providerId}.svg`
  }

  const getConnectedProvider = throttle(async () => {
    const rsp = await ProviderRepository.connected();
    if (rsp.status === HttpStatusCode.Ok) {
      setConnected(rsp.data)
    }
  }, 200)

  const filteredApps = providers
    .sort((a, b) =>
      sort === 'ascending'
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName),
    )
    .map(e => ({
      ...e,
      connected: connected.includes(e.id)
    }))
    .filter((app) =>
      appType === 'connected'
        ? app.connected
        : appType === 'notConnected'
          ? !app.connected
          : true,
    )
    .filter((app) => app.displayName.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    getConnectedProvider()
  }, [])

  return (
    <motion.div
      transition={{
        tension: 190,
        friction: 70,
        mass: 0.4
      }}
      initial={{
        x: '10%'
      }}
      animate={{ x: 0 }}
    >
      {/* ===== Content ===== */}
      <div className="flex flex-col">
        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filter apps..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="w-36">
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="notConnected">Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="shadow" />
        <ul className="no-scrollbar grid gap-4 overflow-y-scroll pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <li
              key={app.displayName}
              className="rounded-lg border p-4 hover:shadow-md"
            >
              <div className="mb-8 flex items-center justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                >
                  <img src={getLogoFileName(app.id)} alt={'logo provider'} className={'h-5 w-5'} />
                </div>
                <Button
                  onClick={() => navigate(`/provider?open_provider=${app.id}`)}
                  variant="outline"
                  size="sm"
                  className={`${app.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {app.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div>
                <h2 className="mb-1 font-semibold">{app.displayName}</h2>
                {/*<p className="line-clamp-2 text-gray-500">{app.desc}</p>*/}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
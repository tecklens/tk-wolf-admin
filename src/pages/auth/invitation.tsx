import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { AxiosError, HttpStatusCode } from 'axios'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { throttle } from 'lodash'
import InviteError from '@/pages/errors/invite-error.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Button } from '@/components/custom/button.tsx'
import { useAuth } from '@/context/auth.tsx'
import { useTheme } from '@/components/theme-provider.tsx'

const OrgRepository = RepositoryFactory.get('org')
const UserRepository = RepositoryFactory.get('user')
export default function Invitation() {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<any>(null)
  const [error, setError] = useState(false)
  const { token } = useAuth()
  const [user, setUser] = useState<any>(null)
  const { theme } = useTheme()
  const fetchData = throttle(async () => {
    if (loading || !id) return
    if (token && token !== '') {
      const info = await UserRepository.getInfoMe()

      setUser(info.data)
      return
    }

    try {
      const rsp = await OrgRepository.getInviteData(id)
      if (rsp.status === HttpStatusCode.Ok) {
        setInviteInfo(rsp.data)
        setError(false)
      }
    } catch (e: any) {
      console.log('abc')
      return (
        setError(true)
      )
    }

    // if (rsp.status === HttpStatusCode.Ok) {
    //   setInviteInfo(rsp.data)
    //   setError(false)
    // } else {
    //   console.log('abc')
    //   return (
    //     setError(true)
    //   )
    // }
  }, 200, { trailing: true })

  const logout = throttle(() => {
    localStorage.clear()

    window.location.reload()
  }, 200)

  useEffect(() => {
    fetchData()
  }, [id, token])

  return (
    <div className={'mt-32 h-[100vh] w-[100vw] flex justify-center'}>
      {error ? <InviteError />
        : token && token !== '' && user ?
          <div className={'flex flex-col space-y-4 md:space-y-8 items-center'}>
            <img src={`/logo_${theme}_2.png`} className={'h-28 aspect-square'} alt={'logo'} />

            <div className={'text-2xl font-semibold'}>You are logged in</div>
            <div className={'flex space-x-4 px-8 shadow-lg py-2 rounded-lg'}>
              <div>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt={user?.email} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className={'flex flex-col space-y-1 flex-1'}>
                <div className={'font-bold'}>{user?.firstName} {user?.lastName}</div>
                <div className={'text-slate-500 text-sm'}>{user?.email}</div>
              </div>
            </div>
            <div className={'w-full'}>
              <Button className={'w-full'} onClick={logout}>Logout to continue</Button>
            </div>
          </div>
          : <div className={'flex flex-col space-y-4 md:space-y-8 items-center'}>
            <img src={`/logo_${theme}_2.png`} className={'h-28 aspect-square'} alt={'logo'} />
            <div className={'text-2xl font-semibold'}>You are invited by</div>
            <div className={'flex space-x-4 px-8 shadow-lg py-2 rounded-lg'}>
              <div>
                <Avatar>
                  <AvatarImage src={inviteInfo?.inviter?.profilePicture} alt={inviteInfo?.inviter?.email} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className={'flex flex-col space-y-1 flex-1'}>
                <div className={'font-bold'}>{inviteInfo?.inviter?.firstName} {inviteInfo?.inviter?.lastName}</div>
                <div className={'text-slate-500 text-sm'}>{inviteInfo?.organization?.name}</div>
              </div>
            </div>
            <div className={'w-full'}>
              <Link to={`/sign-in?invite_token=${id}`}>
                <Button className={'w-full'}>Sign in to continue</Button>
              </Link>
            </div>
          </div>}
    </div>
  )
}
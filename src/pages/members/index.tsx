import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { useOrg } from '@/lib/store/orgStore.ts'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth.tsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@/components/ui/avatar.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconSend } from '@tabler/icons-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { throttle } from 'lodash'

const OrgRepository = RepositoryFactory.get('org')

const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .optional(),
})

export default function Members() {
  const { members, fetchMembers } = useOrg()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const rsp = await OrgRepository.inviteMembers(data)

    if (rsp.status === HttpStatusCode.Created) {
      toast({
        title: `Email invitation has been sent to ${data.email}.`,
      })
      fetchMembers()
    } else {
      toast({
        variant: 'destructive',
        title: `Unable to send an invitation to ${data.email}.`,
      })
    }
    setLoading(false)
  }

  const copyLink = throttle(async (member: any) => {
    if (!member?.invite?.token) return
    const rsp = await OrgRepository.getInviteData(member?.invite?.token)

    if (rsp.status === HttpStatusCode.Ok) {
      navigator.clipboard.writeText(`http://localhost:5173/auth/invitation/${member?.invite?.token}`)
        .then(() => {
          toast({
            title: `Link invite copied.`,
          })
        })
    } else {
      toast({
        variant: 'destructive',
        title: `Get Link invite failed.`,
      })
    }
  }, 200)

  const delMember = throttle(async (member: any) => {
    const rsp = await OrgRepository.delMember(member._id)

    if (rsp.status === HttpStatusCode.Ok) {
      toast({
        title: `Member have been deleted.`,
      })
      fetchMembers()
    } else {
      toast({
        variant: 'destructive',
        title: `Send delete member failed.`,
      })
    }
  }, 200)

  const resend = throttle(async (member: any) => {
    setLoading(true)
    const data = {
      memberId: member._id,
    }
    const rsp = await OrgRepository.resendInviteMembers(data)

    if (rsp.status === HttpStatusCode.Created) {
      toast({
        title: `Email invitation has been sent to ${member?.invite?.email}.`,
      })
      fetchMembers()
    } else {
      toast({
        variant: 'destructive',
        title: `Unable to send an invitation to ${member?.invite?.email}.`,
      })
    }

    setLoading(false)
  }, 300)

  useEffect(() => {
    if (token) {
      fetchMembers()
    }
  }, [token])
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col space-y-4" fixedHeight>
        <div className="flex items-center justify-between space-y-2">
          <div className={'inline-flex space-x-2 items-center'}>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Members
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-start space-x-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder={'Invite member by email'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant={'default'} loading={loading}><IconSend size={16} className={'mr-1'} />Invite</Button>
              </div>

            </form>
          </Form>
        </div>
        {members ? members.map(e => {
            return (<div className={'w-full inline-flex space-x-3 items-center'} key={e._id}>
              <div>
                <Avatar>
                  <AvatarImage src={e.user?.profilePicture} alt={e.user?.email} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className={'flex flex-col space-y-1 flex-1'}>
                <div>{e.user?.firstName} {e.user?.lastName}</div>
                <div className={'text-slate-500 text-sm'}>{e.user?.email ?? e.invite?.email}</div>
              </div>
              <div className={'flex space-x-2 text-xs'}>
                <div
                  className={`${e.memberStatus === 'invited' ? 'block' : 'hidden'} px-2 py-1 border text-slate-700 border-slate-500 rounded capitalize`}>Invite Pending</div>
                <div className={'px-2 py-1 border text-slate-700 border-slate-500 rounded capitalize'}>{e.roles}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`${e.isDefault ? 'hidden' : 'flex'} h-8 w-8 p-0 data-[state=open]:bg-muted`}
                  >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => copyLink(e)}>Copy invite link</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => resend(e)}>Resend</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => delMember(e)}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>)
          })
          : null}
      </LayoutBody>
    </Layout>
  )
}
import { Separator } from '@/components/ui/separator'
import { ChangePassword } from './change-password.tsx'
import { useUser } from '@/lib/store/userStore.ts'
import { Link } from 'react-router-dom'

export default function SettingsAccount() {
  const {user} = useUser()

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Change Password</h3>
        <p className='text-sm text-muted-foreground'>
          The password reset link will be sent to your email <Link to={'https://gmail.com'} className={'underline'}>{user?.email}</Link>.
        </p>
      </div>
      <Separator />
      <ChangePassword />
    </div>
  )
}

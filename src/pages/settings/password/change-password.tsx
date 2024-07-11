import { Button } from '@/components/custom/button.tsx'
import { IconLockAccess } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function ChangePassword() {
  const [sent, setSent] = useState(false)

  const sendEmail = () => {
    setSent(true)
  }

  return (
    <div>
      {sent ?
        <div className={'flex flex-col'}>
          <span>We have just sent a verification link to your email address</span>
          <Link to={'https://gmail.com'} className={'underline'}>dieptv1999@gmail.com</Link>
          <span>Please verify your email address to proceed with setting a password.</span>
          <span>The password reset link is valid for 2 minutes.</span>
        </div>
        : <Button variant={'outline'} onClick={sendEmail}><IconLockAccess className="mr-2" size={18} />Set
          password</Button>}
    </div>
  )
}

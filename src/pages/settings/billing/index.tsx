import { Elements } from '@stripe/react-stripe-js'
import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import CheckoutForm from '@/pages/settings/billing/checkout-form.tsx'
import { useState } from 'react'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { AxiosResponse } from 'axios'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTheme } from '@/components/theme-provider.tsx'
import { throttle } from 'lodash'
import PricingPage from '@/pages/settings/billing/tier/pricing-page.tsx'
import { toast } from '@/components/ui/use-toast.ts'

const UserRepository = RepositoryFactory.get('user')

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: ' "Gill Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '10px',
    colorBackground: '#F6F8FA',
    accessibleColorOnColorPrimary: '#262626',
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input': {
      padding: '12px',
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray',
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
      border: 'none',
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: 'none',
      backgroundColor: '#fff',
      boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Label': {
      fontWeight: '500',
    },
  },
}

export default function BillingSetting() {
  const { theme } = useTheme()
  const [clientSecret, setClientSecret] = useState('')
  const [loadingSecret, setLoadingSecret] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)
  const [options, setOptions] = useState<StripeElementsOptions>({
    // passing the client secret obtained from the server
    clientSecret,
    appearance: {
      ...appearance,
      theme: theme === 'light' ? appearance.theme : 'night',
    },
  })

  const fetchSecret = throttle(() => {
    if (loadingSecret || clientSecret) return
    setLoadingSecret(true)
    UserRepository.createPaymentIndent({
      plan: 'free',

    })
      .then(async (result: AxiosResponse) => {
        const clientSecret = result.data
        setClientSecret(clientSecret)

        setOpenPayment(true)
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Fetch Stripe Client Secret failed. Retry',
        })
      })
      .finally(() => setLoadingSecret(false))
  }, 300)

  // useEffect(() => {
  //   if (clientSecret) {
  //     setOptions({
  //       clientSecret: clientSecret,
  //       ...options,
  //       appearance: {
  //         ...options.appearance,
  //         theme: theme === 'light' ? appearance.theme : 'night',
  //       }
  //     })
  //   }
  // }, [options])

  return (
    <div className={'w-full'}>
      <PricingPage open={fetchSecret}/>
      <Dialog open={openPayment} onOpenChange={setOpenPayment}>
        <DialogContent className="sm:max-w-[885px] flex space-x-4">
          <div className={'flex-1'}>
            <DialogHeader>
              <DialogTitle>Upgrade to business</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {clientSecret && clientSecret != '' ? <Elements stripe={stripePromise} options={{
                ...options,
                clientSecret: clientSecret ?? '',
              }}>
                <CheckoutForm />
              </Elements>
              : null}
          </div>
          <div className={'w-[300px] h-full'}>
            <div className={'text-xl font-bold'}>Order summary</div>
            <div className={'flex flex-col'}>
              <div className={'flex justify-between font-semibold'}>
                <div>Monthly package</div>
                <div>$250</div>
              </div>
              <div className={'flex justify-between text-xs text-slate-500'}>
                <div>250,000 events per month</div>
                <div>billed monthy</div>
              </div>
              <div className={'bg-gray-100 p-3 rounded-lg my-3'}>
                If you consume over 250,000 events per month, you will be billed monthly for an overage based on the
                table
                below
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

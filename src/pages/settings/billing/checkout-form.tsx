import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import React from 'react'
import { Button } from '@/components/custom/button.tsx'

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
      },
    })

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message)
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  return (
    <form onSubmit={handleSubmit} className={'flex flex-col space-y-3'}>
      <PaymentElement className={'my-3'}/>
      <div className={'text-sm'}>By providing your card information, you allow Wolf, Inc. to charge your card for future payments in accordance with their terms.</div>
      <div className={'inline-flex space-x-1 items-center text-sm'}>
        <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd"
                d="M47.9999 10.3338C47.9999 6.91586 46.3466 4.21893 43.1866 4.21893C40.0133 4.21893 38.0933 6.91586 38.0933 10.3071C38.0933 14.3257 40.3599 16.3551 43.6133 16.3551C45.1999 16.3551 46.3999 15.9946 47.3066 15.4873V12.8171C46.3999 13.271 45.3599 13.5514 44.0399 13.5514C42.7466 13.5514 41.5999 13.0974 41.4533 11.522H47.9733C47.9733 11.3484 47.9999 10.6542 47.9999 10.3338ZM41.4133 9.0654C41.4133 7.55672 42.3333 6.92921 43.1733 6.92921C43.9866 6.92921 44.8533 7.55672 44.8533 9.0654H41.4133Z"
                fill="#525266"></path>
          <path fillRule="evenodd" clipRule="evenodd"
                d="M32.9471 4.21893C31.6404 4.21893 30.8004 4.83309 30.3337 5.26032L30.1604 4.43255H27.2271V20L30.5604 19.2924L30.5737 15.514C31.0537 15.8611 31.7604 16.3551 32.9337 16.3551C35.3204 16.3551 37.4937 14.4326 37.4937 10.2002C37.4804 6.32841 35.2804 4.21893 32.9471 4.21893ZM32.1471 13.4179C31.3604 13.4179 30.8937 13.1375 30.5737 12.7904L30.5604 7.83709C30.9071 7.44991 31.3871 7.18289 32.1471 7.18289C33.3604 7.18289 34.2004 8.5447 34.2004 10.2937C34.2004 12.0828 33.3737 13.4179 32.1471 13.4179Z"
                fill="#525266"></path>
          <path fillRule="evenodd" clipRule="evenodd" d="M22.6401 3.43124L25.9868 2.71028V0L22.6401 0.70761V3.43124Z"
                fill="#525266"></path>
          <path d="M25.9868 4.44592H22.6401V16.1282H25.9868V4.44592Z" fill="#525266"></path>
          <path fillRule="evenodd" clipRule="evenodd"
                d="M19.0533 5.43391L18.84 4.44593H15.96V16.1282H19.2933V8.21095C20.08 7.18291 21.4133 7.36983 21.8266 7.51669V4.44593C21.4 4.28571 19.84 3.99199 19.0533 5.43391Z"
                fill="#525266"></path>
          <path fillRule="evenodd" clipRule="evenodd"
                d="M12.3868 1.54871L9.13345 2.24297L9.12012 12.9372C9.12012 14.9132 10.6001 16.3685 12.5735 16.3685C13.6668 16.3685 14.4668 16.1682 14.9068 15.9279V13.2176C14.4801 13.3912 12.3735 14.0053 12.3735 12.0293V7.28969H14.9068V4.4459H12.3735L12.3868 1.54871Z"
                fill="#525266"></path>
          <path fillRule="evenodd" clipRule="evenodd"
                d="M3.37333 7.83709C3.37333 7.3164 3.8 7.11613 4.50667 7.11613C5.52 7.11613 6.8 7.42321 7.81333 7.9706V4.83309C6.70667 4.3925 5.61333 4.21893 4.50667 4.21893C1.8 4.21893 0 5.63415 0 7.9973C0 11.6822 5.06667 11.0948 5.06667 12.6836C5.06667 13.2977 4.53333 13.498 3.78667 13.498C2.68 13.498 1.26667 13.044 0.146666 12.4299V15.6075C1.38667 16.1415 2.64 16.3685 3.78667 16.3685C6.56 16.3685 8.46667 14.9933 8.46667 12.6034C8.45333 8.62481 3.37333 9.33242 3.37333 7.83709Z"
                fill="#525266"></path>
        </svg>
        <div>secure all transactions</div>
      </div>
      <Button disabled={!stripe}>Submit</Button>
    </form>
  )
}

export default CheckoutForm
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import {toast, useToast} from "@/components/ui/use-toast"
import {useToastGlobal} from "@/lib/store/toastStore.ts";
import {useEffect} from "react";
import {throttle} from "lodash";

export function Toaster() {
  const { toasts } = useToast()
  const {title, description, variant} = useToastGlobal(state => state)

  const showT = throttle(() => {
    toast({
      title: title ?? '',
      description,
      variant: variant ?? 'default',
    })
  }, 100)

  useEffect(() => {
    if (title) {
      showT()
    }
  }, [title, description, variant])

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

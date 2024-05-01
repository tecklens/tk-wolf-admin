import { IIntegratedProvider } from '@/types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconCopy } from '@tabler/icons-react'
import { useMemo } from 'react'
import { get, reduce } from 'lodash'
import { makeid } from '@/utils'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToast } from '@/components/ui/use-toast.ts'

const ProviderRepository = RepositoryFactory.get('provider')

const formSchema = z.object({
  status: z
    .boolean(),
  name: z.string().min(1, { message: 'Name not found. Please input name' }),
  identifier: z.string().min(5, { message: 'Identifier not found. Please reset browser' }),
})

export default function UpdateProvider({ selected, onCreateSuccess }: {
  selected: IIntegratedProvider | null,
  onCreateSuccess: () => void
}) {
  const { toast } = useToast()
  const validationSchema = useMemo(() => {
    if (selected) {
      return z.object({
        status: z
          .boolean(),
        name: z.string().min(1, { message: 'Name not found. Please input name' }),
        identifier: z.string().min(5, { message: 'Identifier not found. Please reset browser' }),
        credentials: z.object({
          ...reduce(selected.credentials, (acc, val) => {
            const req = val.required ? get(z, val.type) : get(z, val.type)().nullable
            return {
              ...acc,
              [val.key]: req(),
            }
          }, {})
        }),
      })
    } else return formSchema
  }, [selected])
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      status: true,
      name: '',
      identifier: 'provider-' + makeid(5),
    },
  })


  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!selected) return
    console.log(data)

    const rsp = await ProviderRepository.create({
      ...data,
      active: true,
      providerId: selected?.providerId,
      channel: selected.channel,
    })
    if (rsp.status === HttpStatusCode.Created) {
      onCreateSuccess()
    } else {
      toast({
        variant: 'destructive',
        title: 'Create provider failed',
      })
    }
  }

  if (!selected) return null

  return (<div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col space-y-3'} id={'edit-provider'}>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Name <span className={'text-red-500'}>*</span></FormLabel>
              <FormControl>
                <Input placeholder={selected?.displayName} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Provider Identifier</FormLabel>
              <FormControl>
                <div className={'flex items-center space-x-2'}>
                  <Input
                    disabled
                    placeholder="Provider Identifier"
                    {...field}
                  />
                  <Button variant="outline" size="icon" type={'button'} className={'aspect-square'}>
                    <IconCopy size={18} />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selected.credentials?.map(cre => (
          <FormField
            key={cre.key}
            control={form.control}
            name={`credentials.${cre.key}`}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>{cre.displayName} {cre.required ?
                  <span className={'text-red-500'}>*</span> : null}</FormLabel>
                <FormControl>
                  <div className={'flex items-center space-x-2'}>
                    <Input
                      placeholder={cre.displayName}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  </div>)
}
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconSailboat } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { allExpanded, darkStyles, defaultStyles, JsonView } from 'react-json-view-lite'

import 'react-json-view-lite/dist/index.css'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useEffect } from 'react'

const WorkflowRepository = RepositoryFactory.get('wf')

const json = {
  _workflowId: '<workflow id>',
  _userId: '<user id>',
  requestData: '<data api sent>',
  taskId: '<task id>'
}

const methods = ['put', 'post', 'get', 'delete', 'patch']

const formSchema = z.object({
  webhookUrl: z
    .string()
    .min(1, { message: 'Please enter your url' })
    .url({ message: 'Invalid webhook url address' }),
  method: z
    .enum(['post', ...methods]),
})

export default function WebhookNodeInfo({ onClose, reloadNode }: { onClose: () => void, reloadNode: () => void }) {
  const { theme } = useTheme()
  const { node } = useNode((state) => state)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: '',
      method: 'post',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!node) return
    const rsp = await WorkflowRepository.updateNode([{
      id: node.id,
      data: {
        ...node.data,
        webhookUrl: data.webhookUrl,
        method: data.method,
      },
    }])

    if (rsp.status === HttpStatusCode.Ok) {
      reloadNode()
      onClose()
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred when submitting a update webhook node request',
      })
    }
  }

  useEffect(() => {
    if (node.data && form) {
      form.reset({
        webhookUrl: node.data?.webhookUrl,
        method: node.data?.method,
      })
    }
  }, [node, form])

  return (
    <>
      <SheetHeader className={'p-3'}>
        <SheetTitle>
          <div className={'inline-flex space-x-2 items-center'}>
            <IconSailboat color={'rgb(244,75,14)'} size={28} />
            <div className={'font-bold text-lg'}>Webhook</div>
          </div>
        </SheetTitle>
        {/*<SheetDescription>*/}
        {/*  Make changes to your node of flow here. Click save when you're done.*/}
        {/*</SheetDescription>*/}
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id={'update-webhook-node'}
          className={'p-3 flex flex-col space-y-3'}>
          <FormField
            control={form.control}
            name="webhookUrl"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="https://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method for api" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {methods.map(e => (
                      <SelectItem key={e} value={e} className={'uppercase'}>{e.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div
        className={`flex flex-col space-y-3 my-3 px-3`}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>
            <div>Payload</div>
          </Label>
          <div className={'rounded overflow-hidden'}>
            <JsonView
              data={json}
              shouldExpandNode={allExpanded}
              style={{
                ...(theme === 'light' ? defaultStyles : darkStyles),
              }}
              
            />
          </div>
        </div>
      </div>
      <SheetFooter>
        <Button type="submit" form={'update-webhook-node'}>Save changes</Button>
      </SheetFooter>
    </>
  )
}
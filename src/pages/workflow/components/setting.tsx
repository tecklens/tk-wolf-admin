import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconCopy } from '@tabler/icons-react'
import { IWorkflowEntity } from '@/types/workflow.interface.ts'
import { useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea.tsx'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/components/ui/use-toast.ts'
import { useWorkflow } from '@/lib/store/workflowStore.ts'

const WorkflwoRepository = RepositoryFactory.get('wf')

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter workflow name' }),
  description: z
    .string(),
  identifier: z
    .string(),
  _id: z
    .string(),
})

export default function WorkflowSetting({ workflow, onClose }: {
  workflow: IWorkflowEntity | null;
  onClose: () => void
}) {
  const { toast } = useToast()
  const { fetchWf } = useWorkflow()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      identifier: '',
      description: '',
      _id: '',
    },
  })

  const copyWorkflowIdentifier = () => {
    navigator.clipboard.writeText(form.getValues()?.identifier)
      .then(() => {
        toast({
          title: 'Workflow identifier copied to clipboard',
        })
      })
  }

  const copyWorkflowId = () => {
    navigator.clipboard.writeText(form.getValues()?._id)
      .then(() => {
        toast({
          title: 'Workflow Id copied to clipboard',
        })
      })
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    WorkflwoRepository.update({
      workflowId: workflow?._id,
      ...data,
    }).then(() => {
      toast({
        title: 'Update successful',
      })
      fetchWf()
      onClose()
    })
      .catch((e: AxiosError) => {
        toast({
          title: 'Update failed',
          description: e.message,
          variant: 'destructive',
        })
      })
  }

  useEffect(() => {
    if (workflow) {
      form.reset(workflow)
    }
  }, [form, workflow])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={'modal-setting'}>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="tecklens" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Please input workflow description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="_id"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Workflow Id</FormLabel>
                <FormControl>
                  <div className={'flex items-center space-x-2'}>
                    <Input
                      disabled
                      {...field}
                      placeholder="Workflow Id"
                    />
                    <Button variant="outline" size="icon" type={'button'}
                            className={'aspect-square'} onClick={copyWorkflowId}>
                      <IconCopy size={18} />
                    </Button>
                  </div>
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
                <FormLabel>Workflow identifier</FormLabel>
                <FormControl>
                  <div className={'flex items-center space-x-2'}>
                    <Input
                      disabled
                      {...field}
                      placeholder="Workflow Identifier"
                    />
                    <Button variant="outline" size="icon" type={'button'}
                            className={'aspect-square'} onClick={copyWorkflowIdentifier}>
                      <IconCopy size={18} />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
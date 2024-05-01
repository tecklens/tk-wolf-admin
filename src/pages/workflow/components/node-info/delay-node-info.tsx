import { Input } from '@/components/ui/input.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconBrandDaysCounter } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx'
import { useEffect } from 'react'

const WorkflowRepository = RepositoryFactory.get('wf')

export const periods = [
  {
    label: 'sec',
    value: 1000,
  },
  {
    label: 'min',
    value: 1000 * 60,
  },
  {
    label: 'hour',
    value: 1000 * 60 * 60,
  },
  {
    label: 'day',
    value: 1000 * 60 * 60 * 24,
  },
]

const formSchema = z.object({
  delayTime: z
    .number()
    .min(1, { message: 'Min time is 1' })
    .max(5000, { message: 'Max time is 1' }),
  period: z.string().min(1, { message: 'Please select period of delay time' }),
})

export default function DelayNodeInfo({ onClose, reloadNode }: { onClose: () => void, reloadNode: () => void }) {
  const { node } = useNode((state) => state)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delayTime: 5,
      period: '1000',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!node) return
    const rsp = await WorkflowRepository.updateNode([{
      id: node.id,
      data: {
        ...node.data,
        delayTime: data.delayTime,
        period: parseInt(data.period),
      },
    }])

    if (rsp.status === HttpStatusCode.Ok) {
      reloadNode()
      onClose()
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred when submitting a update delay node request',
      })
    }
  }

  useEffect(() => {
    if (node.data && form) {
      form.reset({
        delayTime: node.data?.delayTime,
        period: node.data?.period + ''
      })
    }
  }, [node, form])

  return (
    <>
      <SheetHeader className={'p-3'}>
        <SheetTitle>
          <div className={'inline-flex space-x-2 items-center'}>
            <IconBrandDaysCounter color={'rgb(102, 217, 232)'} size={28} />
            <div className={'font-bold text-lg'}>Delay</div>
          </div>
        </SheetTitle>
        {/*<SheetDescription>*/}
        {/*  Make changes to your node of flow here. Click save when you're done.*/}
        {/*</SheetDescription>*/}
      </SheetHeader>
      <div
        className={`flex flex-col space-y-3 my-3 px-3`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col space-y-3'} id={'update-delay-node'}>
            <FormField
              control={form.control}
              name="delayTime"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Delay Time(ms)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" defaultValue={5} className={'min-w-[350px]'}
                           min={1}
                           max={5000} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={`${field.value}`}
                      className="flex space-x-1"
                    >
                      {periods.map(e => (
                        <FormItem key={e.label} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={`${e.value}`} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {e.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </div>
    </>
  )
}
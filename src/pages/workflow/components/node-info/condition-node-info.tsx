import { Input } from '@/components/ui/input.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx'
import { IconBrandDaysCounter, IconGitBranch } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx'
import React, { useEffect } from 'react'
import { CrossCircledIcon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

const WorkflowRepository = RepositoryFactory.get('wf')

export const operators = [
  'is equal to', 'is not equal to', 'contains', 'contains all', 'not contain', 'is empty', 'is not empty', '>', '<', '>=', '<=',
]

const formSchema = z.object({
  conditions: z.array(
    z.object({
      name: z.string().min(1, { message: 'Please name variable' }),
      operator: z.enum(['is equal to', ...operators]),
      value: z.string().min(1, { message: 'Please enter variable value' }),
    }),
  ),
})

// eslint-disable-next-line no-empty-pattern
export default function ConditionNodeInfo({}: { onClose: () => void, reloadNode: () => void }) {
  const { node } = useNode((state) => state)

  const { control, register, ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conditions: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions',
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!node) return
    console.log(data)
  }

  useEffect(() => {
    if (node.data && form) {
      // form.reset({
      //   delayTime: node.data?.delayTime,
      //   period: node.data?.period + ''
      // })
    }
  }, [node, form])

  return (
    <>
      <SheetHeader className={'p-3'}>
        <SheetTitle>
          <div className={'inline-flex space-x-2 items-center'}>
            <IconGitBranch color={'orange'} size={28} />
            <div className={'font-bold text-lg'}>Condition</div>
          </div>
        </SheetTitle>
        {/*<SheetDescription>*/}
        {/*  Make changes to your node of flow here. Click save when you're done.*/}
        {/*</SheetDescription>*/}
      </SheetHeader>
      <div
        className={`flex flex-col space-y-3 my-3 px-3 min-w-[600px]`}>
        <Form {...form} control={control} register={register}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col space-y-3'} id={'update-delay-node'}>
            {fields.map((_item, index) => {
              return (
                <div className={'flex font-semibold space-x-1 text-xs'} key={index}>
                  <div className={'w-[140px] text-start'}>
                    <Input {...register(`conditions.${index}.name`, { required: true })}
                           placeholder={'Select variable'}
                           className={'py-0'} />
                  </div>
                  <div className={'flex-1 text-start'}>
                    <Controller render={({ field: f }) => {
                      return (
                        <div>
                          <Select value={f.value} onValueChange={f.onChange}>
                            <SelectTrigger className="col-span-2 w-full min-w-auto">
                              <SelectValue placeholder="Select a operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>{f.value}</SelectLabel>
                                {operators.map(e => (
                                  <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }}
                                name={`conditions.${index}.name`}
                                control={control}
                    />
                  </div>
                  <div className={'flex-1 text-start'}>
                    <Input
                      {...register(`conditions.${index}.value`, { required: true })}
                      placeholder={'Compare value'}
                      className={'py-0'} />
                  </div>
                  <button type="button" onClick={() => remove(index)}>
                    <CrossCircledIcon color={'red'} />
                  </button>
                </div>
              )
            })}
            <div className={'flex w-full space-x-4'}>
              <Button type="button" className={'flex-1'} onClick={() => {
                append({
                  name: '',
                  operator: '>',
                  value: '',
                })
              }}>Add condition</Button>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </div>
    </>
  )
}
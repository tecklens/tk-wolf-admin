import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconCopy } from '@tabler/icons-react'
import { IVariable, IWorkflowEntity } from '@/types/workflow.interface.ts'
import React, { useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea.tsx'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/components/ui/use-toast.ts'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { CrossCircledIcon } from '@radix-ui/react-icons'
import { get, reduce } from 'lodash'
import { Switch } from '@/components/ui/switch.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useTheme } from '@/components/theme-provider.tsx'

const WorkflowRepository = RepositoryFactory.get('wf')

const varTypes = ['string', 'number', 'boolean', 'date']

const formSchema = z.object({
  variables: z
    .array(z.object({
      _id: z.string().optional(),
      type: z.enum(['string', ...varTypes]),
      name: z.string()
        .min(1, {message: 'Variable name has a min length of 6'})
        .max(50, {message: 'Variable name has a max length of 6'})
        .regex(new RegExp('^[a-zA-Z_]*$'), { message: 'Invalid variable name. Regex: [a-zA-Z_]' }),
      defaultValue: z.any().optional(),
      isDefault: z.boolean().default(false),
      required: z.boolean().default(false).optional(),
    })).optional(),
})

export default function ManageVariables({ workflow, onClose }: {
  workflow: IWorkflowEntity | null;
  onClose: () => void
}) {
  const { toast } = useToast()
  const { theme } = useTheme()
  const { fetchVariable, variables } = useWorkflow()
  const { control, register, ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variables: [],
    },
  })

  const { fields, append, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'variables', // unique name for your Field Array
  })


  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!workflow) return
    // @ts-ignore
    WorkflowRepository.changeVariables(reduce(data.variables, (rlt, e) => [...rlt, {
      ...e,
      workflowId: workflow?._id,
    }], [])).then(() => {
      toast({
        title: 'Update successful',
      })
      fetchVariable()
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
    if (form && variables) {
      form.reset({ variables })
    }
  }, [variables])

  return (
    <Form {...form} control={control} register={register}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={'modal-edit-variable'}>
        <div className={'border min-h-[200px] mb-3 rounded-lg border-dashed p-2'}>
          {fields.length > 0
            ? <div className={'flex flex-col space-y-2'}>
              <div
                className={`grid grid-cols-12 gap-3 font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                <div className={'col-span-2'}>Type</div>
                <div className={'col-span-4'}>Name</div>
                <div className={'col-span-4'}>Default Value</div>
                <div className={'col-span-1'}>Required</div>
                <div className={'col-span-1'}></div>
              </div>
              {
                fields.map((field, index) => (
                  <div className={'grid grid-cols-12 gap-3'} key={field.id}>
                    <Controller
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange} disabled={field.isDefault}>
                          <SelectTrigger className="col-span-2 w-full min-w-auto">
                            <SelectValue placeholder="Select a var type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{f.value}</SelectLabel>
                              {varTypes.map(e => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      name={`variables.${index}.type`}
                      control={control}
                    />
                    <div className={'col-span-4 flex flex-col'}>
                      <Input
                        className={'w-full'}
                        placeholder={'Variable name'}
                        disabled={field.isDefault}
                        {...register(`variables.${index}.name`)}
                      />
                      {/*@ts-ignore*/}
                      <div className={'text-red-500 text-xs'}>{get(form.formState.errors, `variables.${index}.name`)?.message}</div>
                    </div>
                    <Input
                      className={'col-span-4'}
                      disabled={field.isDefault}
                      placeholder={'Default value'}
                      {...register(`variables.${index}.defaultValue`)}
                    />
                    <Controller render={({ field: f }) => (
                      <div className="col-span-1 flex items-center space-x-2">
                        <Switch checked={f.value} onCheckedChange={f.onChange} />
                      </div>
                    )}
                                name={`variables.${index}.required`}
                                control={control}
                    />
                    <Button
                      disabled={field.isDefault}
                      size={'icon'}
                      variant={'outline'} onClick={() => {
                      remove(index)
                    }}>
                      <CrossCircledIcon />
                    </Button>
                  </div>
                ))
              }
            </div>
            : <div className={'flex items-center justify-center h-full py-8 text-xl'}>
              No variables
            </div>}
        </div>

        <div className={'flex justify-between'}>
          <Button type="button" form={'modal-edit-variable'} onClick={() => {
            append({
              name: '',
              type: 'string',
              defaultValue: '',
              isDefault: false,
              required: false,
            })
          }}>Add variable</Button>
          <Button type="submit" form={'modal-edit-variable'}>Save changes</Button>
        </div>
      </form>
    </Form>
  )
}
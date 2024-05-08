import React, { useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconDeviceFloppy, IconVariable } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions'
import './edit-sms.css'
import defaultStyle from './defaultStyle'
import { DialogFooter } from '@/components/ui/dialog.tsx'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const WorkflowRepository = RepositoryFactory.get('wf')

const infoSmsSchema = z.object({
  content: z.object({
    source: z.string().min(1, { message: 'Please input content sms' }),
    plainText: z.string().min(1, { message: 'Please input content sms' }),
  }),
})

export type InfoSmsValues = z.infer<typeof infoSmsSchema>

export default function EditSms({ onClose }: { onClose: () => void }) {
  const { node, smsEdit } = useNode((state) => state)
  const { setOpenEditVariable, variables } = useWorkflow(state => state)

  const form = useForm<InfoSmsValues>({
    resolver: zodResolver(infoSmsSchema),
    defaultValues: {
      content: {
        source: '',
        plainText: '',
      },
    },
  })

  async function onSubmit(data: InfoSmsValues) {
    if (!node) return
    const rsp = await WorkflowRepository.updateNode([{
      id: node.id,
      data: {
        ...node.data,
        ...data,
      },
    }])

    if (rsp.status === HttpStatusCode.Ok) {
      onClose()
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred when submitting a update sms node request',
      })
    }
  }

  useEffect(() => {
    if (smsEdit.data) {
      form.setValue('content', smsEdit.data)
    }
  }, [smsEdit.data])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 min-h-[300px] flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className={`flex-1 mb-12`}>
                <FormLabel className={'inline-flex justify-between w-full'}>
                  <div>Content <span className={'text-red-500'}>*</span></div>
                  <Button
                    type={'button'}
                    variant="default"
                    className={'aspect-square p-1'} size={'smallicon'}
                    onClick={() => setOpenEditVariable(true)}
                  ><IconVariable size={13} /></Button>
                </FormLabel>
                <FormControl>
                  <div className={'h-full'}>
                    <MentionsInput
                      value={field.value.source}
                      onChange={(_: any, newVal: string, newPlainTextValue: string) => field.onChange({
                        source: newVal,
                        plainText: newPlainTextValue,
                      })}
                      className={`border border-slate-300 rounded-lg h-full editor`}
                    >
                      <Mention
                        trigger="@"
                        style={defaultStyle}
                        data={variables.map((e, idx) => ({
                          id: e._id ?? idx,
                          display: `{{${e.name}}}`,
                        }))}
                        renderSuggestion={(
                          _suggestion: SuggestionDataItem,
                          _search,
                          highlightedDisplay,
                          _index,
                          focused,
                        ) => (
                          <div className={`hover:bg-slate-200 rounded px-3 py-1 ${focused ? 'focused' : ''}`}>
                            {highlightedDisplay}
                          </div>
                        )}
                      />
                      {/*<Mention*/}
                      {/*  trigger="#"*/}
                      {/*  data={this.requestTag}*/}
                      {/*  renderSuggestion={this.renderTagSuggestion}*/}
                      {/*/>*/}
                    </MentionsInput>
                    <div className={'text-sm text-slate-700'}>You have insert variables by mentions '@'</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type={'submit'}>
              <IconDeviceFloppy size={18} className={'mr-0.5'} />
              <div>Save</div>
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
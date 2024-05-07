import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input.tsx'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions'
import './edit-sms.css'
import defaultStyle from './defaultStyle'
import { DialogFooter } from '@/components/ui/dialog.tsx'

const infoSmsSchema = z.object({
  content: z.string().min(1, { message: 'Sender is required' }).email(),
})

export type InfoSmsValues = z.infer<typeof infoSmsSchema>

export default function EditSms({ onClose }: { onClose: () => void }) {
  const { node } = useNode((state) => state)

  const form = useForm<InfoSmsValues>({
    resolver: zodResolver(infoSmsSchema),
    defaultValues: {
      content: '',
    },
  })

  async function onSubmit(data: InfoSmsValues) {
    if (!node) return
    console.log(data)
    onClose()
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 min-h-[300px] flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className={`flex-1 mb-8`}>
                <FormLabel>Content <span className={'text-red-500'}>*</span></FormLabel>
                <FormControl>
                  <MentionsInput
                    value={field.value}
                    onChange={(_: any, newVal: string, __: string) => field.onChange(newVal)}
                    className={`border border-slate-300 rounded-lg h-full editor`}
                  >
                    <Mention
                      trigger="@"
                      style={defaultStyle}
                      data={[{
                        id: 1,
                        display: 'abc',
                      }]}
                      renderSuggestion={(
                        _suggestion: SuggestionDataItem,
                        _search,
                        highlightedDisplay,
                        _index,
                        focused,
                      ) => (
                        <div className={`user ${focused ? 'focused' : ''}`}>
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
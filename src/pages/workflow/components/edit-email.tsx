import { Editor, EditorRef, EmailEditor, EmailEditorProps } from 'react-email-editor'
import React, { useEffect, useRef, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input.tsx'
import { IconDeviceFloppy, IconLayout2 } from '@tabler/icons-react'
import { Button } from '@/components/custom/button.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx'
import EmailTemplates from '@/pages/workflow/components/email-templates.tsx'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useNode } from '@/lib/store/nodeStore.ts'
import { HttpStatusCode } from 'axios'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { reduce } from 'lodash'

const WorkflowRepository = RepositoryFactory.get('wf')

const infoEmailSchema = z.object({
  sender: z.string().min(1, { message: 'Sender is required' }).email(),
  subject: z.string().min(5, { message: 'Please lengthen this text to 5 characters or more' }),
})

export type InfoEmailValues = z.infer<typeof infoEmailSchema> & {
  design: any,
  designHtml: string;
}

export default function EditEmail({ onClose }: { onClose: () => void }) {
  const emailEditorRef = useRef<EditorRef>(null)
  const [height, setHeight] = useState(500)
  const ref = useRef<HTMLDivElement>(null)
  const [openSelectTemplates, setOpenSelectTemplates] = useState(false)
  const { node } = useNode((state) => state)
  const { variables } = useWorkflow(state => state)

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor

    unlayer?.exportHtml((data) => {
      const { design, html } = data
      console.log('exportHtml', html)
    })
  }

  // @ts-ignore
  const onReady: EmailEditorProps['onReady'] = (unlayer: Editor) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)

    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
  }

  const form = useForm<InfoEmailValues>({
    resolver: zodResolver(infoEmailSchema),
    defaultValues: {
      sender: '',
      subject: '',
    },
  })

  async function onSubmit(data: InfoEmailValues) {
    if (!node) return

    emailEditorRef.current?.editor?.exportHtml(async (d) => {
      console.log(d.html)
      const rsp = await WorkflowRepository.updateNode([{
        id: node.id,
        data: {
          ...node.data,
          ...data,
          design: d.design,
          designHtml: d.html,
        },
      }])

      if (rsp.status === HttpStatusCode.Ok) {
        onClose()
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred when submitting a update email node request',
        })
      }
    })
  }

  useEffect(() => {
    console.log(ref.current?.clientHeight)
    setHeight(ref.current?.clientHeight ?? 500)
  }, [ref.current])

  useEffect(() => {
    if (node && node.type === 'email' && emailEditorRef.current) {
      const d: InfoEmailValues = node.data

      form.reset(d)
      console.log(d.design)
      emailEditorRef.current.editor?.loadDesign(d.design)
    }
  }, [node, emailEditorRef.current])
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="sender"
            render={({ field }) => (
              <FormItem className={`space-y-1`}>
                <FormLabel>Sender <span className={'text-red-500'}>*</span></FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className={`space-y-1`}>
                <FormLabel>Subject <span className={'text-red-500'}>*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Password Recovery" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={'flex justify-end'}>
            <div className={'flex items-center space-x-3'}>
              <Button type={'submit'}>
                <IconDeviceFloppy size={18} className={'mr-0.5'} />
                <div>Save</div>
              </Button>
              <Dialog open={openSelectTemplates} onOpenChange={(val) => setOpenSelectTemplates(val)}>
                <DialogTrigger asChild>
                  <Button type={'button'}>
                    <IconLayout2 size={18} className={'mr-0.5'} />
                    <div>Template</div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw]">
                  <DialogHeader>
                    <DialogTitle>Free HTML Email Templates</DialogTitle>
                  </DialogHeader>
                  <EmailTemplates
                    callback={(design) => {
                      try {
                        const des = JSON.parse(design)

                        emailEditorRef.current?.editor?.loadDesign(des)
                        setOpenSelectTemplates(false)
                      } catch (e) {
                        toast({
                          variant: 'destructive',
                          title: 'An error occurred when import design template',
                        })
                      }
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
      </Form>
      <div className={'h-full flex-1 min-h-[600px]'} ref={ref}>
        <EmailEditor options={{
          designTags: {
            business_name: 'Tesla Inc',
            current_user_name: 'Elon Musk',
          },
          mergeTags: reduce(variables, (rlt, val) => ({
            ...rlt,
            [val.name ?? '']: {
              name: val.name,
              value: `{{${val.name}}}`,
              sample: val.defaultValue ?? val.name,
            },
          }), {}),
        }}
                     minHeight={height}
                     ref={emailEditorRef}
                     onReady={onReady}
        />


      </div>
    </>
  )
}
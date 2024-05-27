import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/theme-provider.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { Editor, EditorRef, EmailEditor, EmailEditorProps } from 'react-email-editor'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HttpStatusCode } from 'axios'
import { toast } from '@/components/ui/use-toast.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const WorkflowRepository = RepositoryFactory.get('wf')

const infoEmailSchema = z.object({
  name: z.string().min(1, { message: 'Name template is required' }),
})

export type InfoEmailValues = z.infer<typeof infoEmailSchema> & {
  design: any,
  designHtml: string;
}

export default function CreateLayout() {
  const { theme } = useTheme()
  const emailEditorRef = useRef<EditorRef>(null)
  const [height, setHeight] = useState(500)
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm<InfoEmailValues>({
    resolver: zodResolver(infoEmailSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: InfoEmailValues) {
    emailEditorRef.current?.editor?.exportImage(({ design }) => {
      console.log(design, "design")
    }) // 401 error

    return;
    emailEditorRef.current?.editor?.exportHtml(async (d) => {
      const rsp = await WorkflowRepository.createEmailTemplate({
        ...data,
        design: d.design,
        designHtml: d.html,
        free: false,
        preview: ''
      })

      if (rsp.status === HttpStatusCode.Ok) {
        toast({
          title: 'Create email template request successful',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred when submitting a create email template request',
        })
      }
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

  useEffect(() => {
    setHeight(ref.current?.clientHeight ?? 500)
  }, [ref.current])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <NotificationNav theme={theme} />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={`space-y-1`}>
                  <FormLabel>Name <span className={'text-red-500'}>*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Protect Our Planet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={''}></div>
            <div className={'flex justify-end'}>
              <div className={'flex items-center space-x-3'}>
                <Button type={'submit'}>
                  <IconDeviceFloppy size={18} className={'mr-0.5'} />
                  <div>Save</div>
                </Button>
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
            // mergeTags: reduce(variables, (rlt, val) => ({
            //   ...rlt,
            //   [val.name ?? '']: {
            //     name: val.name,
            //     value: `{{${val.name}}`,
            //     sample: val.defaultValue ?? val.name,
            //   },
            // }), {}),
          }}
                       minHeight={height}
                       ref={emailEditorRef}
                       onReady={onReady}
          />


        </div>
      </LayoutBody>
    </Layout>
  )
}
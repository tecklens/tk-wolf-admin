import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/theme-provider.tsx'
import { Editor, EditorRef, EmailEditorProps } from 'react-email-editor'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import LayoutEditor from '@/components/moveable/LayoutEditor.tsx'


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
    console.log(data)
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
    <div>
      {/*<Form {...form}>*/}
      {/*  <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 grid grid-cols-3 gap-4">*/}
      {/*    <FormField*/}
      {/*      control={form.control}*/}
      {/*      name="name"*/}
      {/*      render={({ field }) => (*/}
      {/*        <FormItem className={`space-y-1`}>*/}
      {/*          <FormLabel>Name <span className={'text-red-500'}>*</span></FormLabel>*/}
      {/*          <FormControl>*/}
      {/*            <Input placeholder="Protect Our Planet" {...field} />*/}
      {/*          </FormControl>*/}
      {/*          <FormMessage />*/}
      {/*        </FormItem>*/}
      {/*      )}*/}
      {/*    />*/}
      {/*    <div className={''}></div>*/}
      {/*    <div className={'flex justify-end'}>*/}
      {/*      <div className={'flex items-center space-x-3'}>*/}
      {/*        <Button type={'submit'}>*/}
      {/*          <IconDeviceFloppy size={18} className={'mr-0.5'} />*/}
      {/*          <div>Save</div>*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*</Form>*/}
      <LayoutEditor />
    </div>
  )
}
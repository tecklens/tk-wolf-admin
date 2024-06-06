import { Layout, LayoutBody } from '@/components/custom/layout.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast.ts'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'

const bugFormSchema = z.object({
  description: z.string().min(1),
  title: z.string().min(1),
})

type BugFormValues = z.infer<typeof bugFormSchema>
export default function BugReport() {

  const form = useForm<BugFormValues>({
      resolver: zodResolver(bugFormSchema),
    },
  )

  function onSubmit(data: BugFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Layout>
      <LayoutBody className={'flex flex-col space-y-4 justify-center items-center h-[100vh]'}>
        <div className={'font-semibold lg:mt-32 xl:mt-48'}>Report a bug or request a feature</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and in
                    emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your description" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and in
                    emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant={'default'} type={'submit'} className={'w-full'}>Submit</Button>
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  )
}
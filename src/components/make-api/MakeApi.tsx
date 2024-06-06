import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {Params} from "./Params";
import {Body} from "./Body";
import {ResponseData} from "./ResponseData";
import {Headers} from "./Headers";
import { useEffect, useRef, useState } from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { IMakeApiProps } from './types/api.interface';
import { defaultHeader } from './constants';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { ListHeaderCommon } from '@/components/make-api/constants/ListMethod.ts'
import { Input } from '@/components/ui/input.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Button } from '@/components/custom/button.tsx'
import { debounce } from 'lodash'

const formSchema = z.object({
  method: z
    .string(),
  url: z
    .string()
    .url({message: 'Your url is invalid'}),

  params: z.array(z.object({
    key: z.string(),
    value: z.string()
  }), {message: 'Params not valid'}).optional(),
  headers: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  body: z.any().optional()
})

const MakeApi = (props: IMakeApiProps) => {
  const [resp, setResp] = useState<AxiosResponse<any, any> | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef()

  const {control, register, ...form} = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      method: 'get',
      headers: defaultHeader,
      body: null
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    debounce(() => {
      console.log(data.body)
      axios({
        method: data.method,
        url: data.url,
        params: data.params?.reduce((rlt, val) => ({
          ...rlt,
          [val.key]: val.value,
        }), {}),
        data: data.body,
        headers: data.headers?.reduce((rlt, val) => ({
          ...rlt,
          [val.key]: val.value,
        }), {}),
      }).then((resp: AxiosResponse) => {
        setResp(resp)
      }).catch((e: AxiosError) => {
        setResp(e.response)
      }).finally(() => {
        setLoading(false)
      })
    }, 300)()
  }

  useEffect(() => {
    if (props) {
      form.reset({
        method: props.method,
        url: props.url,
        params: props.params,
        body: props.defaultBody,
        headers: props.defaultHeaders,
      })

      if (props.defaultHeaders == null && props.useDefaultHeader !== false) {
        form.setValue('headers', defaultHeader)
      }
    }
  }, [props])

  return (
    <div>
      <Form {...form} control={control} register={register}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col space-y-2'}>
          <div className="flex space-x-0 sm:space-x-1">
            <FormField
              control={control}
              name="method"
              render={({field}) => (
                <FormItem className={`w-[120px] mr-3`}>
                  {/*<FormLabel>Email</FormLabel>*/}
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className=''>
                        <SelectValue placeholder='method'>{field.value?.toUpperCase()}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ListHeaderCommon.map(e => (
                          <SelectItem value={e} key={e}>
                            <div className='flex gap-x-4 px-2 py-1'>{e.toUpperCase()}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="url"
              render={({field}) => (
                <FormItem className={`flex-1 w-full`}>
                  {/*<FormLabel>Email</FormLabel>*/}
                  <FormControl>
                    <Input placeholder="Enter URL" {...field} />
                  </FormControl>
                  <FormMessage className={'!mt-0'}/>
                </FormItem>
              )}
            />
          </div>
          <Tabs defaultValue={'params'} className={'flex flex-col space-y-1'}>
            <TabsList className={''}>
              <TabsTrigger value='params' className={'flex-1'}>Params</TabsTrigger>
              <TabsTrigger value='headers' className={'flex-1'}>Headers</TabsTrigger>
              <TabsTrigger value='body' className={'flex-1'}>Body</TabsTrigger>
            </TabsList>
            <TabsContent value='params' className='space-y-4'>
              <Params control={control} register={register}/>
            </TabsContent>
            <TabsContent value='headers' className='space-y-4'>
              <Headers control={control} register={register}/>
            </TabsContent>
            <TabsContent value='body' className='space-y-4'>
              <FormField
                control={control}
                name="body"
                render={({field}) => (
                  <FormItem className={`flex-1 w-full`}>
                    {/*<FormLabel>Email</FormLabel>*/}
                    <FormControl>
                      <Body ref={bodyRef} value={field.value} theme={props.theme} onChange={(val) => field.onChange(val)}/>
                    </FormControl>
                    <FormMessage className={'!mt-0'}/>
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          <Button disabled={loading}>
            Send
          </Button>
        </form>
      </Form>
      <ResponseData data={resp} theme={props.theme}/>
    </div>
  )
}

export {MakeApi}
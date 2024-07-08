import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { TopNav } from '@/components/top-nav.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import CustomColorPicker from '@/components/custom/custom-color-picker.tsx'
import BrandLogoPicker from '@/components/custom/brand-logo-picker.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
// @ts-ignore
import { LIST_FONTS } from '@/constant/system-setting.ts'
import { useOrg } from '@/lib/store/orgStore.ts'
import { Button } from '@/components/custom/button.tsx'
import { useEffect } from 'react'

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const brandSchema = z.object({
  color: z
    .string()
    .min(3, {message: 'Please select color'})
    .optional(),
  logo: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
  font: z.string().optional(),
})

export default function Brand() {
  const {theme} = useTheme()
  const {updateBrand, brand, fetchBrand} = useOrg()

  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      color: '#ffffff',
      logo: null,
      font: 'ui-sans-serif'
    },
  })

  async function onSubmit(data: z.infer<typeof brandSchema>) {
    updateBrand(data)
  }

  useEffect(() => {
    fetchBrand()
  }, [fetchBrand])

  useEffect(() => {
    form.reset(brand)
  }, [brand])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav}/>
        <div className="ml-auto flex items-center space-x-4">
          <Search/>
          <ThemeSwitch/>
          <NotificationNav theme={theme}/>
          <UserNav/>
        </div>
      </LayoutHeader>
      <LayoutBody>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={'w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8'}>
              <div className={'flex flex-col space-y-4'}>
                <FormField
                  control={form.control}
                  name="color"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <CustomColorPicker
                          hexColor={field.value ?? '#fff'}
                          onChange={(color) => field.onChange(color)}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="font"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Font Family</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className='h-12 sm:w-48'>
                            <SelectValue placeholder='Select brand font'/>
                          </SelectTrigger>
                          <SelectContent>
                            {LIST_FONTS.map((item: string) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <Button type={'submit'}>
                  Update Brand
                </Button>
              </div>
              <div className={'flex flex-col space-y-2'}>
                <FormField
                  control={form.control}
                  name="logo"
                  render={({field}) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Organization Logo</FormLabel>
                      <FormControl>
                        <BrandLogoPicker logo={field.value} onChange={field.onChange}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'overview',
    isActive: true,
    target: '_blank',
  },
  {
    title: 'Document',
    href: 'https://docs.wolfx.app',
    isActive: false,
    target: '_blank',
  },
  {
    title: 'Pricing',
    href: 'pricing',
    isActive: false,
    target: '_blank',
  },
]

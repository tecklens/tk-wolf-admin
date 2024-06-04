import {useFieldArray, Control, UseFormRegister} from "react-hook-form";
import {CrossCircledIcon} from "@radix-ui/react-icons";
import { Input } from '@/components/ui/input.tsx'

export function Headers({control, register}: { control: Control<any, any>; register: UseFormRegister<any> }) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: "headers",
  });

  return (
    <div className={'flex flex-col space-y-1 w-full'}>
      <div className={'flex justify-start'}>
        <div className={'text-slate-700 text-sm font-semibold text-start'}>Headers</div>
      </div>
      <div
        id={'make-api-params'}
        className={'border rounded-lg p-2 text-sm flex flex-col space-y-1 h-[250px] overflow-y-auto'}
      >
        <div className={'flex font-semibold space-x-1'}>
          <div className={'w-[140px] text-start'}>Key</div>
          <div className={'flex-1 text-start'}>Value</div>
        </div>

        {fields.map((_item, index) => {
          return (
            <div className={'flex font-semibold space-x-1 text-xs'} key={index}>
              <div className={'w-[140px] text-start'}>
                <Input {...register(`headers.${index}.key`, {required: false})} className={'py-0'}/>
              </div>
              <div className={'flex-1 text-start'}>
                <Input {...register(`headers.${index}.value`, {required: false})} className={'py-0'}/>
              </div>
              <button type="button" onClick={() => remove(index)}>
                <CrossCircledIcon color={'red'}/>
              </button>
            </div>
          );
        })}

        <div
          onClick={() => {
            append({
              key: '',
              value: ''
            });
          }}
          className={'py-1 px-4 flex justify-center font-bold border rounded-lg cursor-pointer'}
        >Add params</div>
      </div>
    </div>
  )
}
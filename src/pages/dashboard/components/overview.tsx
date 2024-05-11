import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { camelCase } from 'lodash'
import { useEffect, useState } from 'react'
import { useAnalysis } from '@/lib/store/analysisStore.ts'

const periodsType = [
  'hour',
  'day',
  'month',
]

export function Overview() {
  const [period, setPeriod] = useState('hour')
  const { trigger, fetchTriggerData } = useAnalysis()

  useEffect(() => {
    fetchTriggerData(period, 'create_trigger')
  }, [period])

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle className={'flex justify-between'}>
          <div>Overview (Trigger Api Call)</div>
          <div>
            <Select onValueChange={(val) => setPeriod(val)} value={period}>
              <SelectTrigger className="w-[100px] capitalize">
                <SelectValue className={'capitalize'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className={'capitalize'}>{camelCase(period)}</SelectLabel>
                  {periodsType.map(e =>
                    <SelectItem key={e} value={e} className={'capitalize'}>{camelCase(e)}</SelectItem>,
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          {trigger.length > 0 ?
            <BarChart data={trigger}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="count"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
            : <div className={'h-full flex items-center justify-center'}>No data</div>}

        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

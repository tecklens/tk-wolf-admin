import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
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
import { useAnalysis } from '@/lib/store/analysisStore'

const periodsType = [
  'hour',
  'day',
  'month',
]

export function ErrorChart() {
  const [period, setPeriod] = useState('day')
  const { taskErrors, fetchTaskError } = useAnalysis();

  useEffect(() => {
    fetchTaskError(period, '')
  }, [period])

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className={'flex justify-between'}>
          <div>Errors</div>
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
          {taskErrors.length > 0 ?
            <LineChart width={600} height={300} data={taskErrors} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="count" stroke="#FF5733" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={11}
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
            </LineChart>
            : <div className={'h-full flex items-center justify-center'}>No data</div>
          }

        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
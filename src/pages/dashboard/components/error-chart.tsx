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
import { useState } from 'react'

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

const periodsType = [
  'hour',
  'day',
  'month',
]

export function ErrorChart() {
  const [period, setPeriod] = useState('month')

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className={'flex justify-between'}>
          <div>Errors</div>
          <div>
            <Select onValueChange={(val) => setPeriod(val)} value={period}>
              <SelectTrigger className="w-[100px] capitalize">
                <SelectValue className={'capitalize'}/>
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
          <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="total" stroke="#FF5733" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

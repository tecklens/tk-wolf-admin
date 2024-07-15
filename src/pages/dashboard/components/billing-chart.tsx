import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card.tsx'
import {useEffect, useState} from "react";
import {useAnalysis} from "@/lib/store/analysisStore.ts";
import {nFormatter} from "@/utils";

export function BillingChart() {
    const [period, setPeriod] = useState('month')
    const {billings, fetchAnalBilling} = useAnalysis();

    console.log(billings)

    useEffect(() => {
        fetchAnalBilling(period, '')
    }, [period])

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className={'flex justify-between'}>
                    <div>Billing</div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    {billings.length > 0 ?
                        <LineChart width={600} height={300} data={billings}
                                   margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                            <Line type="monotone" dataKey="count" stroke="#8884d8"/>
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
                                tickFormatter={(value) => `${nFormatter(value, 0)} USD`}
                            />
                            <YAxis/>
                        </LineChart>
                        : <div className={'h-full flex items-center justify-center'}>No data</div>
                    }
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

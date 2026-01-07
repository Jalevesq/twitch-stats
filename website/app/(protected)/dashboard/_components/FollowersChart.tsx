'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subDays, subWeeks, subMonths } from 'date-fns'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import {ChartConfig, ChartContainer} from "@/app/_components/ui/chart"
import {Period} from "@/app/(protected)/dashboard/page";


type ChartType = 'followers' | 'subscribers'

interface ChartDataPoint {
    date: string
    dateLabel: string
    value: number
    total: number
    change: number
}

// Mock function to generate data - replace with real API call
const generateData = (
    period: Period,
    startDate: Date,
    endDate: Date,
    chartType: ChartType
): ChartDataPoint[] => {
    let total = chartType === 'followers' ? 35000 : 1100

    if (period === 'daily') {
        const days = eachDayOfInterval({ start: startDate, end: endDate })
        return days.map((day) => {
            const change = chartType === 'followers'
                ? Math.floor(Math.random() * 200) - 50
                : Math.floor(Math.random() * 20) - 5
            total += change

            return {
                date: format(day, 'yyyy-MM-dd'),
                dateLabel: format(day, 'EEE dd/MM'),
                value: change,
                total,
                change,
            }
        })
    } else if (period === 'weekly') {
        const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
        return weeks.map((weekStart) => {
            const change = chartType === 'followers'
                ? Math.floor(Math.random() * 1000) - 200
                : Math.floor(Math.random() * 100) - 20
            total += change

            return {
                date: format(weekStart, 'yyyy-MM-dd'),
                dateLabel: format(weekStart, 'dd/MM'),
                value: change,
                total,
                change,
            }
        })
    } else {
        const months = eachMonthOfInterval({ start: startDate, end: endDate })
        return months.map((month) => {
            const change = chartType === 'followers'
                ? Math.floor(Math.random() * 5000) - 1000
                : Math.floor(Math.random() * 200) - 50
            total += change

            return {
                date: format(month, 'yyyy-MM-dd'),
                dateLabel: format(month, 'MMM yyyy'),
                value: change,
                total,
                change,
            }
        })
    }
}

const chartConfig = {
    followers: {
        label: 'Followers',
        color: '#9146ff',
    },
    subscribers: {
        label: 'Subscribers',
        color: '#ec4899',
    },
} satisfies ChartConfig

const periods: { label: string; value: Period }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
]

export function FollowersChart() {
    const [chartType] = useState<ChartType>('followers')
    const [period] = useState<Period>('daily')
    const [startDate] = useState<Date | null>(subDays(new Date(), 7))
    const [endDate] = useState<Date | null>(new Date())

    const data = startDate && endDate
        ? generateData(period, startDate, endDate, chartType)
        : []
    const color = chartConfig[chartType].color

    return (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 p-6 relative">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-[#0a0a0a]/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-2xl font-display text-white">Coming Soon</span>
                    <p className="text-white/40 text-sm mt-2">Analytics charts are under development</p>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-lg font-medium">Overview</h3>

                    <div className="inline-flex rounded-lg bg-white/5 p-1">
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-[#9146ff] text-white">
                            Followers
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md text-white/60">
                            Subscribers
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={() => {}}
                        dateFormat="MMM dd, yyyy"
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm w-full sm:w-auto"
                        disabled
                    />

                    <div className="inline-flex rounded-lg bg-white/5 p-1">
                        {periods.map((p) => (
                            <button
                                key={p.value}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    period === p.value
                                        ? 'bg-[#9146ff] text-white'
                                        : 'text-white/60'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="fillChart" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="dateLabel"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                        tickFormatter={(value) =>
                            new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
                        }
                    />
                    <Tooltip content={() => null} />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke={color}
                        strokeWidth={2}
                        fill="url(#fillChart)"
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    )
}
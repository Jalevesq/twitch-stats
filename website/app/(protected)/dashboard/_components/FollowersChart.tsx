'use client'

import {Period} from "@/app/(protected)/dashboard/page";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/app/_components/ui/chart";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {useState} from "react";

type ChartType = 'followers' | 'subscribers'

interface FollowersChartProps {
    period: Period
}

// Mock data - replace with real data from your API
const generateData = (period: Period) => {
    if (period === 'daily') {
        return [
            { date: 'Mon', followers: 1200, subscribers: 45 },
            { date: 'Tue', followers: 1350, subscribers: 52 },
            { date: 'Wed', followers: 1100, subscribers: 38 },
            { date: 'Thu', followers: 1450, subscribers: 61 },
            { date: 'Fri', followers: 1600, subscribers: 78 },
            { date: 'Sat', followers: 2100, subscribers: 95 },
            { date: 'Sun', followers: 1800, subscribers: 82 },
        ]
    } else if (period === 'weekly') {
        return [
            { date: 'Week 1', followers: 5200, subscribers: 180 },
            { date: 'Week 2', followers: 6100, subscribers: 220 },
            { date: 'Week 3', followers: 5800, subscribers: 195 },
            { date: 'Week 4', followers: 7200, subscribers: 310 },
        ]
    } else {
        return [
            { date: 'Jan', followers: 12000, subscribers: 450 },
            { date: 'Feb', followers: 15000, subscribers: 520 },
            { date: 'Mar', followers: 18000, subscribers: 610 },
            { date: 'Apr', followers: 22000, subscribers: 780 },
            { date: 'May', followers: 28000, subscribers: 920 },
            { date: 'Jun', followers: 35000, subscribers: 1100 },
        ]
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

export function FollowersChart({ period }: FollowersChartProps) {
    const [chartType, setChartType] = useState<ChartType>('followers')
    const data = generateData(period)
    const color = chartConfig[chartType].color

    return (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-medium">Overview</h3>
                <div className="inline-flex rounded-lg bg-white/5 p-1">
                    <button
                        onClick={() => setChartType('followers')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            chartType === 'followers'
                                ? 'bg-[#9146ff] text-white'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        Followers
                    </button>
                    <button
                        onClick={() => setChartType('subscribers')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            chartType === 'subscribers'
                                ? 'bg-[#ec4899] text-white'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        Subscribers
                    </button>
                </div>
            </div>
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
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                        tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey={chartType}
                        stroke={color}
                        strokeWidth={2}
                        fill="url(#fillChart)"
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    )
}
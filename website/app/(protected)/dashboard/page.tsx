"use client";

import {useState} from "react";
import {PeriodSelector} from "@/app/(protected)/dashboard/_components/PeriodSelector";
import {StatsCard} from "@/app/(protected)/dashboard/_components/StatsCard";
import {FollowersChart} from "@/app/(protected)/dashboard/_components/FollowersChart";

export type Period = 'daily' | 'weekly' | 'monthly'

const statsData = {
    daily: {
        followers: { current: 1800, previous: 1650 },
        subscribers: { current: 82, previous: 78 },
        viewers: { current: 892, previous: 920 },
        watchHours: { current: 2540, previous: 2200 },
    },
    weekly: {
        followers: { current: 7200, previous: 6400 },
        subscribers: { current: 310, previous: 280 },
        viewers: { current: 1250, previous: 1100 },
        watchHours: { current: 8500, previous: 7800 },
    },
    monthly: {
        followers: { current: 35420, previous: 31500 },
        subscribers: { current: 1248, previous: 1150 },
        viewers: { current: 4200, previous: 4300 },
        watchHours: { current: 12540, previous: 10800 },
    },
}

const periodLabels = {
    daily: 'vs yesterday',
    weekly: 'vs last week',
    monthly: 'vs last month',
}

function calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0
    return Number((((current - previous) / previous) * 100).toFixed(1))
}

export default function DashboardPage() {
    const [period, setPeriod] = useState<Period>('monthly')

    const data = statsData[period]
    const label = periodLabels[period]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-display">Analytics</h1>
                <PeriodSelector value={period} onChange={setPeriod} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Followers"
                    value={data.followers.current}
                    change={calculateChange(data.followers.current, data.followers.previous)}
                    periodLabel={label}
                    icon="👥"
                />
                <StatsCard
                    title="Subscribers"
                    value={data.subscribers.current}
                    change={calculateChange(data.subscribers.current, data.subscribers.previous)}
                    periodLabel={label}
                    icon="⭐"
                />
                <StatsCard
                    title="Avg. Viewers"
                    value={data.viewers.current}
                    change={calculateChange(data.viewers.current, data.viewers.previous)}
                    periodLabel={label}
                    icon="👀"
                />
                <StatsCard
                    title="Watch Hours"
                    value={data.watchHours.current}
                    change={calculateChange(data.watchHours.current, data.watchHours.previous)}
                    periodLabel={label}
                    icon="⏱️"
                />
            </div>

            {/* Chart */}
            <FollowersChart period={period} />
        </div>
    )
}
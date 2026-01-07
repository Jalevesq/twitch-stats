'use client'

import { useState } from 'react'
import { StatsCard } from './_components/StatsCard'
import { FollowersChart } from './_components/FollowersChart'
import {Period, periodChangeLabels, PeriodSelector} from "@/app/(protected)/dashboard/_components/PeriodSelector";

// Mock data - replace with real API data
const statsData = {
    followers: {
        day: { value: 35420, change: 127 },
        week: { value: 35420, change: 892 },
        month: { value: 35420, change: 3240 },
        all: { value: 35420, change: 35420 },
    },
    subscribers: {
        day: { value: 1248, change: 12 },
        week: { value: 1248, change: 67 },
        month: { value: 1248, change: 198 },
        all: { value: 1248, change: 1248 },
    },
    viewers: {
        day: { value: 892, change: -24 },
        week: { value: 892, change: 156 },
        month: { value: 892, change: -89 },
        all: { value: 892, change: 892 },
    },
    watchHours: {
        day: { value: 12540, change: 1420 },
        week: { value: 12540, change: 4280 },
        month: { value: 12540, change: 8920 },
        all: { value: 12540, change: 12540 },
    },
}

export default function DashboardPage() {
    const [period, setPeriod] = useState<Period>('month')

    const periodLabel = periodChangeLabels[period]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-display">Analytics</h1>
                    <PeriodSelector value={period} onChange={setPeriod} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Followers"
                    icon="👥"
                    value={statsData.followers[period].value}
                    change={statsData.followers[period].change}
                    periodLabel={periodLabel}
                />
                <StatsCard
                    title="Subscribers"
                    icon="⭐"
                    value={statsData.subscribers[period].value}
                    change={statsData.subscribers[period].change}
                    periodLabel={periodLabel}
                />
                <StatsCard
                    title="Avg. Viewers"
                    icon="👀"
                    value={statsData.viewers[period].value}
                    change={statsData.viewers[period].change}
                    periodLabel={periodLabel}
                />
                <StatsCard
                    title="Watch Hours"
                    icon="⏱️"
                    value={statsData.watchHours[period].value}
                    change={statsData.watchHours[period].change}
                    periodLabel={periodLabel}
                />
            </div>

            {/* Chart */}
            <FollowersChart />

            {/* Additional Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 p-6">
                    <h3 className="text-lg font-medium mb-4">Top Clips</h3>
                    <p className="text-white/60">Coming soon...</p>
                </div>
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 p-6">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <p className="text-white/60">Coming soon...</p>
                </div>
            </div>
        </div>
    )
}
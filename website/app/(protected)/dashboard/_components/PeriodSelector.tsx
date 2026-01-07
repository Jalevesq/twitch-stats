'use client'

import {Period} from "@/app/(protected)/dashboard/page";

interface PeriodSelectorProps {
    value: Period
    onChange: (period: Period) => void
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
    const periods: { label: string; value: Period }[] = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ]

    return (
        <div className="inline-flex rounded-lg bg-white/5 p-1">
            {periods.map((period) => (
                <button
                    key={period.value}
                    onClick={() => onChange(period.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        value === period.value
                            ? 'bg-[#9146ff] text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    {period.label}
                </button>
            ))}
        </div>
    )
}
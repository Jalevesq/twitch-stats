'use client'

import { useState } from 'react'

type Period = 'day' | 'week' | 'month' | 'all'

interface PeriodSelectorProps {
    value: Period
    onChange: (period: Period) => void
}

const periodLabels: Record<Period, string> = {
    day: 'Last 24 hours',
    week: 'Last 7 days',
    month: 'Last 30 days',
    all: 'All Time',
}

const periodChangeLabels: Record<Period, string> = {
    day: 'in last 24h',
    week: 'in last 7 days',
    month: 'in last 30 days',
    all: 'all time',
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
            >
                {periodLabels[value]}
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-lg py-1 z-20 min-w-[160px]">
                        {(Object.keys(periodLabels) as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    onChange(p)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    value === p
                                        ? 'text-[#9146ff] bg-[#9146ff]/10'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export type { Period }
export { periodLabels, periodChangeLabels }
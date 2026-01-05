'use client'

import TwitchAuthSection from "@/app/_components/Twitchauthsection";

export default function Home() {
    return (
        <main className="flex-1 flex items-center justify-center px-8 py-12 relative">
            <div className="max-w-2xl text-center animate-fadeInUp">
                <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.2] mb-6 tracking-tight bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent pb-2">
                    Connect your stream, grow your community
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed mb-12 font-normal">
                    Join thousands of creators building authentic connections with their audience. Start streaming smarter today.
                </p>

                <TwitchAuthSection />

                <div className="mt-24 pt-16 border-t border-border">
                    <div className="text-base uppercase tracking-widest text-text-secondary mb-8 font-semibold">
                        Why StreamHub?
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-8 rounded-2xl border border-border bg-bg-secondary/30 backdrop-blur-sm animate-fadeIn [animation-delay:0.2s] hover:border-accent/30 transition-colors duration-300">
                            <div className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-xl flex items-center justify-center text-3xl">
                                🎮
                            </div>
                            <div className="text-base text-text-primary leading-relaxed font-medium">
                                Real-time engagement tools for interactive streaming
                            </div>
                        </div>
                        <div className="text-center p-8 rounded-2xl border border-border bg-bg-secondary/30 backdrop-blur-sm animate-fadeIn [animation-delay:0.3s] hover:border-accent/30 transition-colors duration-300">
                            <div className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-xl flex items-center justify-center text-3xl">
                                📊
                            </div>
                            <div className="text-base text-text-primary leading-relaxed font-medium">
                                Advanced analytics to understand your audience
                            </div>
                        </div>
                        <div className="text-center p-8 rounded-2xl border border-border bg-bg-secondary/30 backdrop-blur-sm animate-fadeIn [animation-delay:0.4s] hover:border-accent/30 transition-colors duration-300">
                            <div className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-xl flex items-center justify-center text-3xl">
                                🚀
                            </div>
                            <div className="text-base text-text-primary leading-relaxed font-medium">
                                Grow faster with automation & insights
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
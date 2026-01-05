export default function FeatureSection() {
  return (
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
  );
}

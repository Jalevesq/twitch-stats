'use client'

interface TwitchAuthButtonProps {
    clientId: string
    redirectUri: string
    scope: string
}

export default function TwitchAuthButton({ clientId, redirectUri, scope }: TwitchAuthButtonProps) {
    const handleTwitchAuth = () => {
        if (!clientId) {
            alert('Twitch Client ID is not configured. Please add TWITCH_CLIENT_ID to your .env file.')
            return
        }

        if (!redirectUri) {
            alert('Redirect URI is not configured. Please add TWITCH_REDIRECT_URI to your .env file.')
            return
        }

        // Construct Twitch OAuth URL
        const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`

        // Redirect to Twitch OAuth
        window.location.href = authUrl
    }

    return (
        <button
            className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-semibold bg-accent text-white border-none rounded-xl cursor-pointer transition-all duration-300 ease-out overflow-hidden hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(145,70,255,0.3)] active:translate-y-0"
            onClick={handleTwitchAuth}
        >
            <span className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <svg className="w-6 h-6 fill-current relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
            <span className="relative z-10">Sign in with Twitch</span>
        </button>
    )
}
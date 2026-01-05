import TwitchAuthButton from "@/app/_components/Twitchauthbutton";

export default function TwitchAuthSection() {
    // These environment variables are only accessible on the server
    const clientId = process.env.TWITCH_CLIENT_ID || ''
    const redirectUri = process.env.TWITCH_REDIRECT_URI || ''
    const scope = process.env.TWITCH_SCOPE || ''

    return (
        <div className="flex flex-col items-center gap-6">
            <TwitchAuthButton
                clientId={clientId}
                redirectUri={redirectUri}
                scope={scope}
            />
            <a
                href="#"
                className="text-text-secondary no-underline text-base transition-colors duration-300 relative pb-0.5 hover:text-text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-text-primary after:transition-all after:duration-300 hover:after:w-full"
            >
                Learn more
            </a>
        </div>
    )
}
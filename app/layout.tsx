import { DM_Sans, Archivo_Black } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-dm-sans',
})

const archivoBlack = Archivo_Black({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-archivo-black',
})

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${dmSans.variable} ${archivoBlack.variable} font-sans bg-bg-primary text-text-primary min-h-screen flex flex-col overflow-x-hidden`}>
        <header className="relative px-12 py-8 border-b border-border backdrop-blur-xl z-10">
            <div className="font-display text-2xl tracking-tight flex items-center gap-2 animate-fadeInDown">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-[#b857ff] rounded-lg flex items-center justify-center text-xl">
                    ⚡
                </div>
                <span>StreamHub</span>
            </div>
        </header>
        {children}
        </body>
        </html>
    )
}
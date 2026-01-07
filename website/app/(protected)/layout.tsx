"use client";

import {ReactNode, useEffect} from "react";
import {useSession} from "@/app/_context/session-context";
import {usePathname, useRouter} from "next/navigation";
import {toast} from "sonner";
import Link from "next/link";

const sidebarItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: '📊',
    },
    {
        name: 'ChatBot',
        href: '/chatbot',
        icon: '🤖',
    },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname()
  useEffect(() => {
    if (!session) {
      toast.warning("You are not logged in!");
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

    return (
        <div className="flex flex-1">
            <aside className="w-16 lg:w-64 border-r border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/50 backdrop-blur-xl transition-all duration-300">
                <nav className="p-2 lg:p-4 flex flex-col gap-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={item.name}
                                className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-[#9146ff] text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="hidden lg:inline font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
    )
}

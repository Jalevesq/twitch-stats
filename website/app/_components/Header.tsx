import Link from "next/link";
import { UserDropdown } from "@/app/_components/UserDropdown";

type User = {
  id: string;
  login: string;
  displayName: string;
  profileImage: string | null;
};

type HeaderProps = {
  user: User | null | undefined;
  showDashboardLink?: boolean;
};

export function Header({ user, showDashboardLink = true }: HeaderProps) {
    return (
        <header className="relative px-8 py-3 border-b border-[rgba(255,255,255,0.08)] backdrop-blur-xl z-10">
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="font-display text-xl tracking-tight flex items-center gap-2.5 animate-fadeInDown"
                >
                    <div className="w-7 h-7 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-lg flex items-center justify-center text-base shadow-md shadow-purple-500/25">
                        ⚡
                    </div>
                    <span className="mt-[-0.12em]">StreamHub</span>
                </Link>

                {user && (
                    <UserDropdown user={user} showDashboardLink={showDashboardLink} />
                )}
            </div>
        </header>
    );
}
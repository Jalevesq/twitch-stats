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
                    className="font-display text-xl tracking-tight flex items-center gap-2 animate-fadeInDown"
                >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#7c3aed] via-[#9146ff] to-[#ec4899] rounded-md flex items-center justify-center text-sm leading-none shadow-lg shadow-purple-500/20">
                        ⚡
                    </div>
                    <span className="mt-[-0.11em]">StreamHub</span>
                </Link>

                {user && (
                    <UserDropdown user={user} showDashboardLink={showDashboardLink} />
                )}
            </div>
        </header>
    );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import { destroySession } from "@/app/_server/auth";
import { toast } from "sonner";

type User = {
  id: string;
  login: string;
  displayName: string;
  profileImage: string | null;
};

type UserDropdownProps = {
  user: User;
  showDashboardLink?: boolean;
};

export function UserDropdown({ user }: UserDropdownProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const router = useRouter();

  const logout = async () => {
    await destroySession();
    toast.success("Logout successful");
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors outline-none">
          <Image
            width={64}
            height={64}
            src={user.profileImage ?? "/default-avatar.png"}
            alt={user.displayName}
            className="w-10 h-10 rounded-full border-2 border-purple-500/50"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <p className="font-medium truncate">{user.displayName}</p>
          <p className="text-sm text-muted-foreground truncate">
            @{user.login}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {!isDashboard && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => logout()}
          className="text-red-400 focus:text-red-400"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { User } from "@auth/core/types";

type UserDropdownProps = {
  user: User;
  showDashboardLink?: boolean;
};

export function UserDropdown({ user }: UserDropdownProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors outline-none">
          <Image
            width={64}
            height={64}
            src={user.image ?? "/default-avatar.png"}
            alt={user.name!}
            className="w-10 h-10 rounded-full border-2 border-purple-500/50"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <p className="font-medium truncate">{user.name}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {!isDashboard && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => signOut({ redirect: true, redirectTo: "/" })}
          className="text-red-400 focus:text-red-400"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

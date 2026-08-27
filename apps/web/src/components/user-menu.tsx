"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 pl-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  // Fallback: If not logged in, show the Sign In button inside /dashboard header
  if (!session?.user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
    );
  }

  const user = session.user;
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const avatarUrl = user.image || undefined;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 pl-2 text-left focus:outline-none group cursor-pointer">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold leading-none text-foreground group-hover:text-primary transition-colors">
            {user.name}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
            {user.email}
          </p>
        </div>

        <div className="h-8 w-8 rounded-full bg-primary/10 border border-border flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/50 transition-colors">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={user.name || "User Avatar"}
              width={32}
              height={32}
              className="object-cover h-full w-full"
            />
          ) : (
            <span className="text-xs font-bold text-primary font-mono">
              {userInitials}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-card border border-border rounded-lg shadow-lg p-1.5 z-50"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="text-xs font-bold text-foreground">{user.name}</p>
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              {user.email}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 border-border" />

          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2 text-xs text-foreground px-2 py-2 rounded-md hover:bg-muted focus:bg-muted"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border" />

          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2 text-xs text-destructive hover:bg-destructive/10 focus:bg-destructive/10 px-2 py-2 rounded-md transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type CustomerTopBarProps = {
  title?: string;
  backHref?: string;
  showProfile?: boolean;
  profileHref?: string;
  rightAction?: ReactNode;
};

export function CustomerTopBar({
  title,
  backHref,
  showProfile = true,
  profileHref = "/settings",
  rightAction,
}: CustomerTopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#F7F8FB]/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[402px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DFF5] bg-white transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/35 active:scale-90"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-[#322D45]" aria-hidden="true" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9FE0C7] font-display text-[#322D45] font-bold"
                aria-hidden="true"
              >
                P
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[#322D45]">
                Perkly<span className="text-[#9FE0C7]">Ph</span>
              </span>
            </div>
          )}
        </div>

        {title ? (
          <div className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate font-display font-semibold text-[#322D45]">
            <span>{title}</span>
          </div>
        ) : null}

        <div
          className={cn(
            "flex items-center",
            backHref && !showProfile && !rightAction ? "h-10 w-10 justify-end" : undefined,
          )}
        >
          {rightAction ? (
            rightAction
          ) : showProfile ? (
            <Link
              href={profileHref}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DFF5] bg-white text-[#322D45]/60 transition-colors",
                "hover:text-[#322D45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45]",
              )}
              aria-label="Open profile settings"
            >
              <UserCircle className="h-7 w-7" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

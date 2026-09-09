"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Gift, Home, QrCode, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  ariaLabel: string;
  icon: typeof Home;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", ariaLabel: "Home", icon: Home },
  { href: "/scan", label: "Scan/Join", ariaLabel: "Scan or join", icon: QrCode },
  { href: "/browse", label: "Browse", ariaLabel: "Browse", icon: Compass },
  { href: "/rewards", label: "Rewards", ariaLabel: "Rewards", icon: Gift },
  { href: "/settings", label: "Settings", ariaLabel: "Settings", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/home") {
    return pathname === "/home" || pathname.startsWith("/card/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CustomerTabNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#B9B4C9]/35 bg-white/94 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      aria-label="Customer navigation"
    >
      <div className="mx-auto grid h-[88px] w-full max-w-[402px] grid-cols-5 px-2 pt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex min-w-0 flex-col items-center justify-center gap-1",
                isActive ? "text-[#322D45]" : "text-[#777185]",
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.ariaLabel}
            >
              <span
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-full",
                  isActive
                    ? "bg-[#9FE0C7]"
                    : "transition group-hover:bg-[#F1EFF8]",
                )}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 1.8 : 1.7}
                  aria-hidden="true"
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  item.label === "Scan/Join" ? "tracking-[-0.02em]" : undefined,
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  QrCode,
  ReceiptText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BusinessNavItem = {
  id: "dashboard" | "scan" | "cards" | "records" | "settings";
  href: string;
  label: string;
  icon: typeof BarChart3;
  isActive: (pathname: string) => boolean;
};

const BUSINESS_NAV_ITEMS: BusinessNavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    id: "scan",
    href: "/biz/scan",
    label: "Scan",
    icon: QrCode,
    isActive: (pathname) => pathname === "/biz/scan",
  },
  {
    id: "cards",
    href: "/cards",
    label: "Cards",
    icon: CreditCard,
    isActive: (pathname) => pathname === "/cards" || pathname.startsWith("/cards/"),
  },
  {
    id: "records",
    href: "/records",
    label: "Records",
    icon: ReceiptText,
    isActive: (pathname) =>
      pathname === "/records" || pathname.startsWith("/records/"),
  },
  {
    id: "settings",
    href: "/biz/settings",
    label: "Settings",
    icon: Settings,
    isActive: (pathname) => pathname === "/biz/settings",
  },
];

export function BusinessTabNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDD8EA] bg-white/95 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
      aria-label="Business navigation"
    >
      <ul className="mx-auto grid w-full max-w-[402px] grid-cols-5 px-2">
        {BUSINESS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive(pathname);

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[64px] w-full flex-col items-center justify-center gap-1 rounded-[16px] px-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7]",
                  isActive
                    ? "text-[#322D45]"
                    : "text-[#8A8497] hover:text-[#322D45]",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 min-w-10 items-center justify-center rounded-full px-2 transition",
                    isActive ? "bg-[#9FE0C7]" : "bg-transparent",
                  )}
                >
                  <Icon aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} />
                </span>
                <span
                  className={cn(
                    "text-[9px] font-medium leading-none",
                    isActive ? "font-semibold" : undefined,
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

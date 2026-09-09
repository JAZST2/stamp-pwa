"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BusinessTabNavigation } from "./business-tab-navigation";

type BusinessRouteShellProps = {
  children: ReactNode;
};

function isFullBleedBusinessRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/cards/create") ||
    /^\/cards\/[^/]+$/.test(pathname) ||
    /^\/cards\/[^/]+\/edit$/.test(pathname)
  );
}

export function BusinessRouteShell({ children }: BusinessRouteShellProps) {
  const pathname = usePathname();
  const fullBleed = isFullBleedBusinessRoute(pathname);

  if (fullBleed) {
    return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <main className="mx-auto w-full max-w-[402px] px-5 pb-28 pt-0">{children}</main>
      <BusinessTabNavigation />
    </div>
  );
}

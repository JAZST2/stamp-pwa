"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/components/auth/use-logout";

export function LogoutButton() {
  const { isLoggingOut, logout } = useLogout();

  return (
    <Button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className="mt-8 max-w-[220px]"
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
}

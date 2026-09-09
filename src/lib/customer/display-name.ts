export function getDisplayFirstName(fullName: string | null | undefined): string {
  const firstName = fullName?.trim().split(/\s+/).filter(Boolean)[0];
  return firstName || "there";
}


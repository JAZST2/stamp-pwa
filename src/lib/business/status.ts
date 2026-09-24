import { createClient } from "@/lib/supabase/server";

export type BusinessStatus = "pending" | "active" | "suspended" | "declined";

const BUSINESS_STATUSES = new Set<BusinessStatus>([
  "pending",
  "active",
  "suspended",
  "declined",
]);

export function normalizeBusinessStatus(
  value?: string | null,
): BusinessStatus | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (BUSINESS_STATUSES.has(normalized as BusinessStatus)) {
    return normalized as BusinessStatus;
  }

  return null;
}

export function canAccessBusinessDashboard(
  status?: BusinessStatus | null,
): boolean {
  return status === "active";
}

function isColumnShapeError(error: { code?: string; message?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "PGRST204" ||
    error.code === "42703" ||
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("has no field")
  );
}

export async function getBusinessStatus(options: {
  userId: string;
  userEmail?: string | null;
}): Promise<BusinessStatus | null> {
  const supabase = await createClient();

  const ownerColumnCandidates: Array<{
    column: string;
    value: string | null | undefined;
  }> = [
    { column: "owner_id", value: options.userId },
  ];

  for (const candidate of ownerColumnCandidates) {
    if (!candidate.value) {
      continue;
    }

    const orderedQuery = supabase
      .from("businesses")
      .select("status")
      .order("created_at", { ascending: false })
      .limit(1);
    const { data: orderedData, error: orderedError } = await orderedQuery
      .eq(candidate.column, candidate.value)
      .maybeSingle<{ status?: string | null }>();

    if (!orderedError) {
      const status = normalizeBusinessStatus(orderedData?.status);
      if (status) {
        return status;
      }
    }

    if (orderedError && !isColumnShapeError(orderedError)) {
      continue;
    }

    const fallbackQuery = supabase.from("businesses").select("status").limit(1);
    const { data: fallbackData, error: fallbackError } = await fallbackQuery
      .eq(candidate.column, candidate.value)
      .maybeSingle<{ status?: string | null }>();

    if (fallbackError) {
      if (isColumnShapeError(fallbackError)) {
        continue;
      }
      continue;
    }

    const fallbackStatus = normalizeBusinessStatus(fallbackData?.status);
    if (fallbackStatus) {
      return fallbackStatus;
    }
  }

  return null;
}

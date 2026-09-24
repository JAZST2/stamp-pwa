export function isPermissionDeniedError(error?: { code?: string } | null): boolean {
  return error?.code === "42501";
}

export function isUniqueViolationError(error?: { code?: string } | null): boolean {
  return error?.code === "23505";
}

export function isColumnShapeError(error?: { code?: string; message?: string } | null): boolean {
  const message = error?.message?.toLowerCase() ?? "";
  return (
    error?.code === "PGRST204" ||
    error?.code === "42703" ||
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("has no field")
  );
}

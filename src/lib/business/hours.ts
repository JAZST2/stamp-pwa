export const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

export type DayHours = {
  open: string;
  close: string;
};

export type BusinessHours = Record<WeekdayKey, DayHours | null>;

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function isTimeValue(value: unknown): value is string {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

export function emptyBusinessHours(): BusinessHours {
  return {
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
    sat: null,
    sun: null,
  };
}

export function parseBusinessHours(value: unknown): BusinessHours {
  const hours = emptyBusinessHours();
  if (!value || typeof value !== "object") {
    return hours;
  }

  const source = value as Record<string, unknown>;
  WEEKDAY_KEYS.forEach((day) => {
    const entry = source[day];
    if (!entry || typeof entry !== "object") {
      hours[day] = null;
      return;
    }

    const open = (entry as { open?: unknown }).open;
    const close = (entry as { close?: unknown }).close;
    hours[day] = isTimeValue(open) && isTimeValue(close) ? { open, close } : null;
  });

  return hours;
}

export function formatBusinessHours(hours: BusinessHours): string[] {
  return WEEKDAY_KEYS.flatMap((day) => {
    const entry = hours[day];
    if (!entry) {
      return [];
    }

    return [`${WEEKDAY_LABELS[day]} ${entry.open}–${entry.close}`];
  });
}

export function hasAnyOpenHours(hours: BusinessHours): boolean {
  return WEEKDAY_KEYS.some((day) => hours[day] !== null);
}

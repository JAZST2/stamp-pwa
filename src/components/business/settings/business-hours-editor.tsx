import {
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  type BusinessHours,
  type WeekdayKey,
} from "@/lib/business/hours";

type BusinessHoursEditorProps = {
  hours: BusinessHours;
  onChange: (hours: BusinessHours) => void;
};

export function BusinessHoursEditor({ hours, onChange }: BusinessHoursEditorProps) {
  const updateDay = (day: WeekdayKey, next: BusinessHours[WeekdayKey]) => {
    onChange({
      ...hours,
      [day]: next,
    });
  };

  return (
    <fieldset className="rounded-[20px] border border-[#D8D3E7] bg-white/70 p-3">
      <legend className="px-1 text-[13px] font-medium text-[#5F596F]">Business hours</legend>
      <div className="mt-2 space-y-2">
        {WEEKDAY_KEYS.map((day) => {
          const entry = hours[day];
          const isOpen = Boolean(entry);

          return (
            <div key={day} className="rounded-2xl bg-[#F7F8FB] px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#322D45]">{WEEKDAY_LABELS[day]}</span>
                <label className="flex items-center gap-2 text-[12px] text-[#6F697E]">
                  <input
                    type="checkbox"
                    checked={isOpen}
                    onChange={(event) =>
                      updateDay(
                        day,
                        event.target.checked ? { open: "08:00", close: "18:00" } : null,
                      )
                    }
                    className="h-4 w-4 accent-[#68B99B]"
                  />
                  Open
                </label>
              </div>
              {entry ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="text-[11px] text-[#746E82]">
                    Open
                    <input
                      type="time"
                      value={entry.open}
                      onChange={(event) =>
                        updateDay(day, { ...entry, open: event.target.value })
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-[#D8D3E7] bg-white px-3 text-[13px] text-[#322D45] outline-none focus:border-[#68C9A3] focus:ring-2 focus:ring-[#9FE0C7]/30"
                    />
                  </label>
                  <label className="text-[11px] text-[#746E82]">
                    Close
                    <input
                      type="time"
                      value={entry.close}
                      onChange={(event) =>
                        updateDay(day, { ...entry, close: event.target.value })
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-[#D8D3E7] bg-white px-3 text-[13px] text-[#322D45] outline-none focus:border-[#68C9A3] focus:ring-2 focus:ring-[#9FE0C7]/30"
                    />
                  </label>
                </div>
              ) : (
                <p className="mt-1 text-[12px] text-[#8A8498]">Closed</p>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

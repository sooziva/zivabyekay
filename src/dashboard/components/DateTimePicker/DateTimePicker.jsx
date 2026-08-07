import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import "./DateTimePicker.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 7; h <= 20; h += 1) {
    for (const m of [0, 30]) {
      if (h === 20 && m === 30) continue;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
})();

function pad(n) {
  return String(n).padStart(2, "0");
}

function parseValue(value) {
  if (!value || typeof value !== "string") return { date: null, time: "" };
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!match) return { date: null, time: "" };
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return { date: null, time: "" };
  const time = match[4] != null ? `${match[4]}:${match[5] || "00"}` : "";
  return { date, time };
}

function toValue(date, time) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const t = time || "09:00";
  return `${y}-${m}-${d}T${t}`;
}

function sameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDisplay(value) {
  const { date, time } = parseValue(value);
  if (!date) return "";
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!time) return dateLabel;
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(date);
  dt.setHours(hh, mm, 0, 0);
  const timeLabel = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${dateLabel} · ${timeLabel}`;
}

function buildMonthCells(year, month) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function DateTimePicker({
  value = "",
  onChange,
  placeholder = "Select date & time",
  disabled = false,
  compact = false,
  id,
  "aria-label": ariaLabel = "Date and time",
}) {
  const autoId = useId();
  const triggerId = id || autoId;
  const rootRef = useRef(null);
  const parsed = useMemo(() => parseValue(value), [value]);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => (parsed.date || new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (parsed.date || new Date()).getMonth());
  const [draftDate, setDraftDate] = useState(parsed.date);
  const [draftTime, setDraftTime] = useState(parsed.time || "09:00");

  useEffect(() => {
    if (!open) return;
    setDraftDate(parsed.date);
    setDraftTime(parsed.time || "09:00");
    const base = parsed.date || new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  }, [open, parsed.date, parsed.time]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const cells = useMemo(() => buildMonthCells(viewYear, viewMonth), [viewYear, viewMonth]);
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const display = formatDisplay(value);
  const timeSlots = useMemo(() => {
    if (draftTime && !TIME_SLOTS.includes(draftTime)) return [draftTime, ...TIME_SLOTS];
    return TIME_SLOTS;
  }, [draftTime]);

  const commit = (nextDate, nextTime) => {
    const next = toValue(nextDate, nextTime);
    onChange?.(next);
  };

  const shiftMonth = (delta) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  return (
    <div className={`zb-dtp ${compact ? "zb-dtp--compact" : ""} ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        id={triggerId}
        className={`zb-dtp__trigger ${value ? "has-value" : ""}`}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="zb-dtp__triggerIcon" aria-hidden>
          <CalendarDays size={compact ? 15 : 17} />
        </span>
        <span className="zb-dtp__triggerText">{display || placeholder}</span>
        {value ? (
          <span
            className="zb-dtp__clear"
            role="button"
            tabIndex={-1}
            aria-label="Clear date and time"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("");
              setOpen(false);
            }}
          >
            <X size={14} />
          </span>
        ) : (
          <span className="zb-dtp__triggerHint" aria-hidden>
            <Clock size={compact ? 14 : 15} />
          </span>
        )}
      </button>

      {open ? (
        <div className="zb-dtp__popover" role="dialog" aria-label="Choose date and time">
          <div className="zb-dtp__calendar">
            <div className="zb-dtp__monthBar">
              <button type="button" className="zb-dtp__nav" aria-label="Previous month" onClick={() => shiftMonth(-1)}>
                <ChevronLeft size={16} />
              </button>
              <p className="zb-dtp__monthLabel">{monthLabel}</p>
              <button type="button" className="zb-dtp__nav" aria-label="Next month" onClick={() => shiftMonth(1)}>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="zb-dtp__weekdays">
              {WEEKDAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="zb-dtp__days">
              {cells.map((day, i) => {
                if (!day) return <span key={`e-${i}`} className="zb-dtp__day zb-dtp__day--empty" />;
                const selected = sameDay(day, draftDate);
                const isToday = sameDay(day, today);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={`zb-dtp__day ${selected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`}
                    onClick={() => {
                      setDraftDate(day);
                      commit(day, draftTime || "09:00");
                    }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="zb-dtp__times">
            <div className="zb-dtp__timesHead">
              <Clock size={14} />
              <span>Time</span>
            </div>
            <div className="zb-dtp__slots" role="listbox" aria-label="Time slots">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  role="option"
                  aria-selected={draftTime === slot}
                  className={`zb-dtp__slot ${draftTime === slot ? "is-selected" : ""}`}
                  disabled={!draftDate}
                  onClick={() => {
                    setDraftTime(slot);
                    if (draftDate) commit(draftDate, slot);
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            {!draftDate ? <p className="zb-dtp__hint">Pick a date first</p> : null}
          </div>

          <div className="zb-dtp__footer">
            <button
              type="button"
              className="zb-dtp__today"
              onClick={() => {
                setDraftDate(today);
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                const t = draftTime || "09:00";
                setDraftTime(t);
                commit(today, t);
              }}
            >
              Today
            </button>
            <button type="button" className="zb-dtp__done" onClick={() => setOpen(false)} disabled={!draftDate}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

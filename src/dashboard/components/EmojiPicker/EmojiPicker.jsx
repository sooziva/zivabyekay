import { useEffect, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import "./EmojiPicker.css";

const EMOJI_GROUPS = [
  {
    label: "Popular",
    emojis: ["✨", "💕", "💖", "💗", "🌸", "💐", "💄", "💋", "🥰", "😍", "🤍", "🖤", "⭐", "🌟", "💫", "🔥"],
  },
  {
    label: "Studio",
    emojis: ["🪞", "💅", "👗", "👠", "💍", "👑", "🎀", "🫶", "💌", "📅", "🗓️", "⏰", "🎁", "🛍️", "🧾", "📍"],
  },
  {
    label: "Celebrate",
    emojis: ["🎉", "🎊", "🥂", "🍾", "🥳", "🎈", "💒", "👰", "🫶", "😻", "☀️", "🌙", "🌊", "🍃", "🌺", "🌷"],
  },
];

/**
 * Compact emoji popover. Calls onPick(emoji) when an emoji is chosen.
 */
export default function EmojiPicker({ onPick, label = "Add emoji" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

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

  return (
    <div className={`zb-emoji ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="zb-emoji__trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={label}
        onClick={() => setOpen((v) => !v)}
      >
        <SmilePlus size={16} aria-hidden />
      </button>

      {open ? (
        <div className="zb-emoji__popover" role="dialog" aria-label="Emoji picker">
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className="zb-emoji__group">
              <p className="zb-emoji__groupLabel">{group.label}</p>
              <div className="zb-emoji__grid">
                {group.emojis.map((emoji) => (
                  <button
                    key={`${group.label}-${emoji}`}
                    type="button"
                    className="zb-emoji__btn"
                    onClick={() => {
                      onPick?.(emoji);
                      setOpen(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

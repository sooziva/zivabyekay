import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart, IoIosCheckmark } from "react-icons/io";
import "../KellsieBain/KellsieBain.css";
import "./Checklist.css";

const STORAGE_KEY = "ziva-checklist-checked";

const Checklist = () => {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {
      // ignore
    }
  }, [checked]);

  const toggleItem = (key) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };
  const sections = [
    {
      id: 1,
      title: "Skin Prep",
      items: ["Cleanser", "Toner or hydrating mist", "Serum", "Moisturizer", "Sunscreen", "Lip balm"],
    },
    {
      id: 2,
      title: "Complexion Essentials",
      items: ["Primer", "Foundation", "Concealer", "Setting powder"],
    },
    {
      id: 3,
      title: "Structure & Dimension",
      items: ["Bronzer", "Contour", "Blush", "Highlighter"],
    },
    {
      id: 4,
      title: "Brows",
      subtitle: "Brows frame the face.",
      items: ["Brow pencil or pen", "Brow powder (optional)", "Brow gel"],
    },
    {
      id: 5,
      title: "Eyes",
      items: ["Transition shade", "Sculpting shade", "Lid enhancer (satin or soft shimmer)", "Eyeliner", "Mascara", "Optional lashes"],
    },
    {
      id: 6,
      title: "Lips",
      items: ["Lip liner", "Lipstick or gloss", "Optional lip topper"],
    },
    {
      id: 7,
      title: "Set & Finish",
      subtitle: "Polish is everything.",
      items: ["Setting spray", "Finishing powder", "Blotting paper"],
    },
    {
      id: 8,
      title: "Tools You Actually Need",
      items: [
        "Foundation brush or sponge",
        "Concealer brush",
        "Powder brush",
        "Blush/Bronzer brush",
        "Blending brush",
        "Angled brow brush",
        "Lash curler",
      ],
    },
    {
      id: 9,
      title: "Hygiene & Maintenance",
      subtitle: "Luxury is clean",
      items: ["Brush cleanser", "Alcohol spray", "Spatula", "Clean makeup bag"],
    },
    {
      id: 10,
      title: "The Ziva Standard",
      subtitle: "This is the Ziva way.",
      items: [
        "Enhance, don't mask",
        "Skin always comes first",
        "Blend twice, then blend again",
        "One feature leads, others support",
      ],
    },
  ];

  return (
    <div className="checklist-page">
      <Link to="/education/resources" className="kellsie-top-banner">
        ← Back to Resources & Templates
      </Link>

      <header className="ekay-page-header">
        <div className="ekay-header-inner">
          <button type="button" className="ekay-header-icon" aria-label="Search">
            <IoIosSearch size={22} />
          </button>
          <Link to="/ekay" className="ekay-logo">
            <span className="ekay-logo-name">EKAY</span>
            <span className="ekay-logo-tagline">MAKEUP</span>
          </Link>
          <div className="ekay-header-icons">
            <Link to="/booking" className="ekay-header-icon" aria-label="Account">
              <IoIosPerson size={22} />
            </Link>
            <Link to="/beauty-store" className="ekay-header-icon" aria-label="Cart">
              <IoIosCart size={22} />
            </Link>
          </div>
        </div>
        <nav className="ekay-nav">
          <Link to="/ekay" className="ekay-nav-link">Home</Link>
          <Link to="/ekay/about" className="ekay-nav-link">About</Link>
          <Link to="/wedding" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link active">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="checklist-main">
        <article className="checklist-article">
          <header className="checklist-header">
            <span className="checklist-badge">Checklist</span>
            <h1 className="checklist-title">
              10 Ziva by Ekay Essential Makeup Checklist
            </h1>
            <p className="checklist-intro">
              This checklist serves as your official shopping guide for building a functional, high-quality makeup kit.
            </p>
            <p className="checklist-intro">
              The listed items reflect what is used and recommended at the Ziva by Ekay Studio for consistent, polished results.
            </p>
            <p className="checklist-intro checklist-intro--note">
              Clients are encouraged to purchase directly from the studio to ensure correct product selection, authenticity, and suitability for their skin and goals.
            </p>
          </header>

          <div className="checklist-sections">
            {sections.map((section) => (
              <section key={section.id} className="checklist-section">
                <div className="checklist-section-header">
                  <span className="checklist-section-num">{String(section.id).padStart(2, "0")}</span>
                  <h2 className="checklist-section-title">{section.title}</h2>
                </div>
                {section.subtitle && (
                  <p className="checklist-section-subtitle">{section.subtitle}</p>
                )}
                <ul className="checklist-items">
                  {section.items.map((item, idx) => {
                    const itemKey = `${section.id}-${idx}`;
                    const isChecked = checked.has(itemKey);
                    return (
                      <li key={item} className="checklist-item">
                        <button
                          type="button"
                          className={`checklist-checkbox ${isChecked ? "checklist-checkbox--checked" : ""}`}
                          onClick={() => toggleItem(itemKey)}
                          aria-pressed={isChecked}
                          aria-label={isChecked ? `Uncheck ${item}` : `Check ${item}`}
                        >
                          {isChecked && <IoIosCheckmark size={14} />}
                        </button>
                        <span className={isChecked ? "checklist-item-text checklist-item-text--checked" : "checklist-item-text"}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </article>

        <div className="checklist-actions">
          <Link to="/education/resources" className="checklist-cta">← Back to Resources</Link>
          <Link to="/beauty-store" className="checklist-cta checklist-cta-primary">Shop products</Link>
        </div>
      </main>

      <footer className="checklist-footer">
        <Link to="/sooziva" className="checklist-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Checklist;

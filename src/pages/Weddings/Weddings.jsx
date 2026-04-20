import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart, IoIosHeart, IoIosCopy } from "react-icons/io";
import "../KellsieBain/KellsieBain.css";
import "./Weddings.css";

const BOOKING_STEPS = [
  {
    id: "reach-out",
    step: 1,
    title: "Reach out",
    text: "Contact me via email, WhatsApp, or the website—tell me a little about your day.",
  },
  {
    id: "consultation",
    step: 2,
    title: "Consultation",
    text: "We meet (in person or virtually) to discuss your vision, skin, timeline, and dreams.",
  },
  {
    id: "proposal",
    step: 3,
    title: "Your proposal",
    text: "I send a tailored quote based on your chosen tier and add-ons.",
  },
  {
    id: "retainer",
    step: 4,
    title: "Secure your date",
    text: "A 30% non-refundable retainer locks in your date. Dates are never held without it.",
  },
  {
    id: "trial",
    step: 5,
    title: "Your trial",
    text: "Schedule 4–8 weeks before your wedding. We perfect your look together.",
  },
  {
    id: "wedding-day",
    step: 6,
    title: "Your wedding morning",
    text: "I arrive, I set up, I take care of you. You walk down the aisle radiant.",
  },
];

const SERVICE_TIERS = [
  {
    id: "celeste",
    roman: "I",
    name: "Céleste - 1 day event",
    subtitle: "2hrs 30mins on site",
    investment: "GHS 3,950",
    investmentNote: "The version of you, you always wanted to see.",
    description: [
      "The Céleste package is for the bride who yearns a seamless experience, ensuring she looks radiant and flawless.",
      "This package is suitable for your engagement, wedding, Muslim wedding or court wedding.",
    ],
    bullets: [
      "Virtual consultations",
      "Skin is deeply prepped, massage and nourished for a finish that's luminous, and alive.",
      "Detailed makeup application, finalizing with a soft and timeless finish.",
      "Bridal touch up kit",
  
    ],
  },
  {
    id: "la-mariee",
    roman: "II",
    name: "LA MARIÉE - 2 looks same day",
    subtitle: "2hrs each",
    investment: "GHS 6,500",
    investmentNote: "Made to be remembered",
    description: [
      "Enjoy the luxury of 2 unique bridal looks tailored to each segments of your event.",
    ],
    bullets: [
      "Virtual consultation",
      "In-depth skin prep with a relaxing massage",
      "Seamless bridal transition for two separate looks, 2 hours per event",
      "Looks tailored to your traditional and white or reception look",
      "Bridal touch up Kit",
      "A dedicated team on standby for touch-ups any beauty emergencies throughout the day",
      
    ],
  },
  {
    id: "ivoire",
    roman: "III",
    name: "IVORY - 2 looks different days",
    subtitle: "2HR 30 MINS PER DAY",
    investment: "GHS 7,500",
    investmentNote: "Beauty that lives in every photograph. Every memory. Forever.",
    description: [
      "Two days, two looks each one detailed, intentional, and entirely yours.",
      "Day One- Traditional Ceremony",
      "Your traditional look is crafted to honour the occasion and complement the richness of your Kente.",
      "Day Two — White Wedding",
      "As you walk down the aisle, your look shifts into something softer, luminous, romantic, and quietly breathtaking. Elegance without effort.",
    ],
    bullets: [
      "Everything in above package",
      "A dedicated team on standby for touch-ups any beauty emergencies throughout the day",
    ],
  },
  {
    id: "grand-affair",
    roman: "IV",
    name: "Grand Affair",
    subtitle: "full day package",
    investment: "$1200",
    investmentNote: "Stand by presence to refresh your looks to ensure Beauty outlasts the day. ",
    description: [
      "Your events deserve more than a single look, you deserve an entire experience. The Grand Affair is a full-day package designed for the bride who wants her beauty to be celebrated in different tones and looks that evolves alongside every moment of her celebration.",
      "From the first look to the final hour, I’m on-site with you refreshing, adjusting, and creating with no creative limits. This closes off all future bookings, so the day is completely yours.",
      "What’s included:",
    ],
    bullets: [
      "Up to 9 hours of on-site presence",
      "Multiple curated looks across your event",
      "A dedicated team on standby for touch-ups and beauty emergencies throughout the day",
    ],
  },
  {
    id: "voyage-edit",
    roman: "VI",
    name: "The voyage Bride",
    subtitle: "Travel package",
    investment: "Inquire",
    investmentNote: "Transportation and hotel to be taken care of by the bride.",
    description: [
      "For the Ziva bride whose celebration is taking place outside Accra entirely. this Travel Package will bring the full experience directly to you. Every detail is handled with the same precision and intentionality you’d expect on home ground, wherever your day unfolds.",
    ],
    bullets: [
      "on-site presence of upto 3hrs with a same day return - 5000 cedis",
      "Full service for multiple days is billed individually as a full day service.",
      "Each day - 10000 cedis",
    ],
  },
];

const WEDDINGS_ADD_ONS = [
  {
    id: "consultation-before-booking",
    title: "Bridal Consultation before booking",
    price: "GHS 700.00",
  },
  {
    id: "trial-in-studio",
    title: "Pre-Wedding Makeup / Bridal Trial In-Studio",
    price: "GHS 1500.00",
  },
  {
    id: "trial-location",
    title:
      "Pre-Wedding Makeup / Bridal Trial Location of Choice within Accra/ out of Accra excludes flight or transport fares",
    price: "GHS 2,200.00 / GHS 3,500.00",
  },
  {
    id: "look-swap",
    title: "look swap for reception (for Ziva  brides who are not booking full day service)",
    price: "GHS 2000.00",
  },
  { id: "stay-on-per-hour", title: "Stay on per hour", price: "GHS 1000.00" },
  { id: "extra-head", title: "Makeup for an Extra head", price: "GHS 1500.00" },
  { id: "delay-fee", title: "Delay fee", price: "750 cedis per 30 mins" },
  { id: "bridesmaids-with-bride", title: "Bridesmaid including Bride", price: "900 cedis each" },
  { id: "bridesmaids-without-bride", title: "Brides maid without bride", price: "1400 cedis each" },
];

/**
 * Tier card images on the Weddings “Service tiers” section (split layout).
 * — Keys must match `SERVICE_TIERS[].id`.
 * — Put files in `public/ekay/` and reference as `/ekay/your-file.jpg`.
 * — If a tier id is missing, `WEDDINGS_TIER_CARD_FALLBACK` is used.
 */
const WEDDINGS_TIER_CARD_MEDIA = {
  celeste: {
    src: "/ekay/IMG_0589.jpg",
    alt: "Bridal makeup — Céleste package",
  },
  "la-mariee": {
    src: "/ekay/IMG_0584.jpg",
    alt: "Bridal makeup — La Mariée package",
  },
  ivoire: {
    src: "/ekay/IMG_0578.jpg",
    alt: "Bridal makeup — Ivoire package",
  },
  "grand-affair": {
    src: "/ekay/IMG_0582.jpg",
    alt: "Bridal makeup — Grand Affair package",
  },
  "voyage-edit": {
    src: "/ekay/bridal5.jpg",
    alt: "Bridal makeup — The Voyage Edit travel package",
  },
};

const WEDDINGS_TIER_CARD_FALLBACK = {
  src: "/ekay/bridal2.JPG",
  alt: "Bridal makeup — Ziva by Ekay",
};

function getWeddingsTierCardMedia(tier, displayTitle) {
  const row = WEDDINGS_TIER_CARD_MEDIA[tier.id];
  return {
    src: row?.src ?? WEDDINGS_TIER_CARD_FALLBACK.src,
    alt: row?.alt ?? `${displayTitle} — bridal package`,
  };
}

const WEDDINGS_HERO_SLIDES = [
  {
    id: "hero-celeste",
    image: "/ekay/bridal.JPG",
    eyebrow: "Bridal beauty with Ziva by Ekay",
    title: "Your wedding day \nbegins  here",
    tierId: "celeste",
  },
  {
    id: "hero-la-mariee",
    image: "/ekay/IMG_8637.JPG",
    eyebrow: "Two looks, one unforgettable day",
    title: "La Mariée",
    tierId: "la-mariee",
  },
  {
    id: "hero-grand-affair",
    image: "/ekay/IMG_8638.JPG",
    eyebrow: "Your celebration, fully yours",
    title: "The Grand Affair",
    tierId: "grand-affair",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Ekay listened to exactly what I wanted and made me feel like the best version of myself. Calm, professional, and somehow made a hectic morning feel peaceful.",
    name: "Sarah M.",
    detail: "",
  },
  {
    id: 2,
    quote:
      "My makeup lasted through tears, heat, and hours of dancing. The trial gave me so much confidence I knew I was in good hands.",
    name: "Jessica L.",
    detail: "",
  },
  {
    id: 3,
    quote:
      "From first email to the last touch up, everything felt luxury without being stuffy. I’ve never felt more beautiful.",
    name: "Amara K.",
    detail: "",
  },
];

const FAQS = [
  {
    q: "Do you travel for weddings?",
    a: "Yes. Travel and accommodation may apply depending on location. Multi-day celebrations and larger parties are quoted individually beyond the tier packages shown here.",
  },
  {
    q: "When should I book?",
    a: "Popular dates fill quickly—many brides secure their date 9–12 months in advance. If your date is sooner, reach out; we’ll always confirm availability before any retainer.",
  },
  {
    q: "Is a trial required?",
    a: "Trials are optional but recommended. They give us time to refine your look, test longevity, and make wedding morning seamless.",
  },
  {
    q: "How many people can you service?",
    a: "Party size depends on your timeline and tier. We’ll build a schedule that keeps you relaxed—not rushed—and can coordinate assistants when needed.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Retainers secure your date and are outlined in your client service agreement. Specific cancellation and reschedule terms are provided in your contract at booking.",
  },
];

const CLIENT_SERVICE_AGREEMENT = {
  intro:
    "This agreement is entered into between Ekay (trading as Ziva by Ekay) (\"Artist\") and the undersigned client (\"Client\") upon receipt of a retainer payment.",
  sections: [
    {
      id: "services",
      title: "1. Services rendered",
      paragraphs: [
        "The Artist agrees to provide bridal makeup services as outlined in the agreed tier and written quote. Changes must be confirmed in writing no later than 21 days before the wedding.",
      ],
    },
    {
      id: "retainer",
      title: "2. Retainer & payment schedule",
      paragraphs: [
        "A non-refundable 70% retainer is required to secure the date. The remaining balance is due no later than 14 days before the wedding. Non-payment may result in cancellation without a refund of the retainer.",
      ],
    },
    {
      id: "Cancellation",
      title: "3. Cancellation policy",
      list: [
        "30 days before: Retainer forfeited; no further charges.",
        "14 days before: Retainer forfeited + 25% of remaining balance.",
        "Within 7days: Retainer forfeited + 50% of remaining balance.",
      ],
      afterList:
        "Should the Artist be unable to fulfill this agreement due to medical emergency or force majeure, they will make reasonable efforts to arrange a qualified replacement artist or provide a full refund of amounts paid.",
    },
    {
      id: "postponement",
      title: "4. Postponement",
      paragraphs: [
        "One complimentary date transfer is allowed with 60 days’ notice. Subsequent or short-notice changes incur a $100 rescheduling fee.",
      ],
    },
    {
      id: "allergies",
      title: "5. Allergies & skin conditions",
      paragraphs: [
        "The Client is responsible for disclosing allergies. The Artist is not liable for reactions from undisclosed conditions. Patch tests are available with 48 hours’ notice.",
      ],
    },
    {
      id: "photography",
      title: "6. Photography & portfolio",
      paragraphs: [
        "The Artist may photograph or film the completed look for portfolio and marketing use. Written objections must be submitted no later than 14 days before the wedding.",
      ],
    },
  ],
};

const TERMS_AND_CONDITIONS = [
  {
    id: "comfort-area",
    title: "2. COMFORTABLE WORKING AREA:",
    items: [
      "a. The client agrees to provide a spacious and well-ventilated working area for the makeup artist’s services",
      "b. The working area should be maintained at a comfortable temperature, either through air conditioning or proper ventilation, to ensure optimal working conditions.",
    ],
  },
  {
    id: "transportation",
    title: "3. TRANSPORTATION:",
    items: [
      "a. For destination weddings within Ghana, the client is responsible for covering the flight fare or transportation expenses for the makeup artist.",
      "b. Transportation fees for destination weddings will be billed separately and must be paid in full prior to the event.",
      "c. Transportation within Accra will calculated based on distance.",
    ],
  },
  {
    id: "accommodation",
    title: "5. ACCOMMODATION:",
    items: [
      "a. The client agrees to provide comfortable hotel accommodation for the makeup artist when traveling for bookings outside of Accra.",
      "b. Accommodation must include amenities that prioritize safety and comfort, with a breakfast in bed option.",
      "c. The makeup artist reserves the right to decline accommodation that does not meet safety and comfort standards.",
    ],
  },
  {
    id: "force-majeure",
    title: "7. FORCE MAJEURE:",
    items: [
      "a. The makeup artist shall not be liable for any failure or delay in performing her obligations under this agreement if such failure or delay is caused by circumstances beyond their reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, or government regulations.",
    ],
  },
  {
    id: "dressing-room",
    title: "8. DRESSING ROOM POLICY:",
    items: [
      "a. The client agrees to limit the number of individuals present in the dressing room during the makeup session to a maximum of 1 person, excluding other wedding vendors.",
      "b. Excessive presence in the dressing room may interfere with the makeup artist’s ability to provide quality service and may disrupt the atmosphere necessary for a successful makeup application.",
      "c. It is the client’s responsibility to communicate and enforce the dressing room policy with their guests. The client acknowledges that failure to comply with this policy may result in delays or suboptimal makeup application for which the makeup artist shall not be held responsible.",
    ],
  },
  {
    id: "full-day-glam",
    title: "9.FULL DAY GLAM",
    items: [
      "a. The Artist shall be available for the agreed-upon duration of the ceremony as specified in the package booked.",
      "b. Meals and Resting Area: The Client shall ensure that adequate provisions are made for the Artist’s meals, including breakfast, water and a suitable resting area or a seat shall be reserved for the Artist at the wedding venue.",
    ],
  },
  {
    id: "delay",
    title: "10. DELAY",
    paragraphs: [
      "A charge of GH₵750.00 will apply for every 30 minutes of delay. Delays are calculated from the agreed start time, not from when the artist arrives or sets up. Delay charges will apply if the bride is not ready for services to begin upon the artist’s arrival.",
    ],
  },
];

const TERMS_AND_CONDITIONS_ACKNOWLEDGEMENT =
  "By booking makeup services provided, the client acknowledges that they have read, understood, and agreed to abide by these terms and conditions.";

const TRAVEL_TERMS = [
  {
    id: "travel-fees",
    title: "Travel fees & logistics",
    text:
      "Travel fees vary by location, dates, time requirements, and logistics. A custom travel quote is provided before booking is confirmed.",
  },
  {
    id: "accommodation",
    title: "Accommodation (when required)",
    text:
      "For early call times, long distances, multi-day events, or when a same-day return is not feasible, accommodation may be required. Accommodation must be confirmed before the booking is finalized.",
  },
  {
    id: "multi-day",
    title: "Multi-day celebrations",
    text:
      "Multi-day bookings are billed per day and outlined in writing as part of your quote. Dates are reserved only after the agreement is signed and retainer is paid.",
  },
  {
    id: "schedule",
    title: "Schedule changes",
    text:
      "Any changes to travel timing, location, or event schedule must be communicated as soon as possible. Last-minute changes may require additional fees if they affect travel arrangements.",
  },
];

const ZIVA_EXPERIENCE_BULLETS = [
  "An artist who genuinely loves what she does, and whose love shows in every brushstroke",
  "A thorough pre-wedding consultation,your vision, your skin, your story, all understood",
  "Full discretion, warmth, and calm professionalism from first contact to final walk down the aisle",
  "Premium, skin loving products from the world's most coveted luxury beauty houses to ensure a hydrated and well nourished canvas",
  "A clean, curated setup that brings the feel of a high-end beauty suite to your space",
  "Excellent customer Impeccable time management, to protect your schedule, always",
  "Attention to detail, care and geniune concern for you comfort and satisfaction.",
  "A commitment to deliver a flawless and unforgettable experience, while promising continous support and guidiance.",
];

const ZIVA_PRODUCTS = {
  makeupBrands:
    "Charlotte Tilbury, Armani Beauty, Pat McGrath, La Mer, NARS, Kevyn Aucoin, Huda Beauty, Fenty Beauty",
  equipment: "Airbrush systems by Dinair & Temptu.",
  skinPrep: "Jade rollers, gua sha, LED wand, hydrating masks.",
};

const Weddings = () => {
  const galleryImages = [
    { id: 1, src: "/ekay/IMG_0582.jpg", alt: "Bridal makeup by Ekay" },
    { id: 2, src: "/ekay/IMG_0580.jpg", alt: "Bridal look" },
    { id: 3, src: "/ekay/IMG_0583.jpg", alt: "Wedding beauty" },
    { id: 4, src: "/ekay/IMG_0589.jpg", alt: "Bridal glamour" },
    { id: 5, src: "/ekay/IMG_0583.jpg", alt: "Ekay bridal" },
    { id: 6, src: "/ekay/IMG_0585.jpg", alt: "Wedding day makeup" },
    { id: 7, src: "/ekay/IMG_7663.JPG", alt: "Bridal artistry" },
    { id: 8, src: "/ekay/IMG_0458.JPG", alt: "Bridal style" },
    { id: 9, src: "/ekay/IMG_1442.PNG", alt: "Wedding makeup" },
    { id: 10, src: "/ekay/IMG_7874.PNG", alt: "Bridal beauty" },
    { id: 11, src: "/ekay/IMG_0127.PNG", alt: "Ekay bridal work" },
  ];

  const [openFaq, setOpenFaq] = useState(null);
  const [sigForm, setSigForm] = useState({
    agreed: false,
    name: "",
    date: "",
    email: "",
  });
  const [sigSubmitted, setSigSubmitted] = useState(false);
  const [sigError, setSigError] = useState("");
  const [sigSending, setSigSending] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [legalModal, setLegalModal] = useState(null);
  const [paymentCopied, setPaymentCopied] = useState(false);
  const [paymentCopiedField, setPaymentCopiedField] = useState(null);

  const PAYMENT_DETAILS_TEXT =
    "STANBIC BANK\nZiva by Ekay Ltd\nAcc No: 0150445111000\nBranch: East Legon\n\nMOBILE MONEY\nMTN: 0247584910\nAccount: Ziva by Ekay Ltd";

  const copyText = async (text, field = "all") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "true");
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    if (field === "all") {
      setPaymentCopied(true);
      window.setTimeout(() => setPaymentCopied(false), 2200);
      return;
    }

    setPaymentCopiedField(field);
    window.setTimeout(() => setPaymentCopiedField(null), 1600);
  };

  const copyPaymentDetails = async () => {
    await copyText(PAYMENT_DETAILS_TEXT, "all");
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;
    const id = window.setInterval(() => {
      setHeroSlide((s) => (s + 1) % WEDDINGS_HERO_SLIDES.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!legalModal) return undefined;
    setPaymentCopied(false);
    setPaymentCopiedField(null);
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLegalModal(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [legalModal]);

  const handleSignatureSubmit = async (e) => {
    e.preventDefault();
    setSigError("");
    if (!sigForm.agreed || !sigForm.name.trim() || !sigForm.date.trim() || !sigForm.email.trim()) return;
    setSigSending(true);
    try {
      const res = await fetch("/api/send-acknowledgement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sigForm.name.trim(),
          date: sigForm.date.trim(),
          email: sigForm.email.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setSigSubmitted(true);
    } catch (err) {
      const msg = typeof err?.message === "string" ? err.message : "";
      setSigError(msg || "We couldn’t send the confirmation email. Please try again in a moment.");
    } finally {
      setSigSending(false);
    }
  };

  return (
    <div className="weddings-page">
      <a href="#main-content" className="weddings-skip-link">
        Skip to content
      </a>

      <header className="ekay-page-header">
        <div className="ekay-header-inner">
          <button type="button" className="ekay-header-icon" aria-label="Search">
            <IoIosSearch size={22} />
          </button>
          <Link to="/ekay" className="ekay-logo">
            <span className="ekay-logo-name">Ziva by Ekay</span>
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
          <Link to="/wedding" className="ekay-nav-link active">Weddings</Link>
          <Link to="/education" className="ekay-nav-link">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main id="main-content" className="weddings-page-main" tabIndex={-1}>
        <section
          className="weddings-hero"
          aria-roledescription="carousel"
          aria-label="Bridal highlights"
        >
          <div className="weddings-hero-slides">
            {WEDDINGS_HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={`weddings-hero-slide${i === heroSlide ? " weddings-hero-slide--active" : ""}`}
                aria-hidden={i !== heroSlide}
              >
                <img
                  className="weddings-hero-bg"
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = "/site-icon.png";
                  }}
                />
                <div className="weddings-hero-overlay" aria-hidden />
                <div className="weddings-hero-content">
                  <p className="weddings-hero-eyebrow">{slide.eyebrow}</p>
                  <h1 className="weddings-hero-title">{slide.title}</h1>
                  <div className="weddings-hero-line" aria-hidden />
                  <Link
                    to={`/wedding/inquiry?tier=${encodeURIComponent(slide.tierId)}`}
                    className="weddings-hero-cta"
                  >
                    Book bridal experience
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="weddings-hero-controls" role="tablist" aria-label="Hero slides">
            {WEDDINGS_HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                className={`weddings-hero-dot${i === heroSlide ? " weddings-hero-dot--active" : ""}`}
                aria-selected={i === heroSlide}
                aria-label={`Slide ${i + 1}: ${slide.title}`}
                onClick={() => setHeroSlide(i)}
              />
            ))}
          </div>
        </section>

        <div className="weddings-main">
        {/* <section className="weddings-intro" aria-label="Weddings introduction">
          <h1 className="weddings-title">Weddings</h1>
          <p className="weddings-lead">
            Ekay and her team are available for engagements, elopements, weddings, and milestone celebrations—where
            natural, refined beauty meets the calm you deserve on your day.
          </p>
          <div className="weddings-cta-group">
            <Link to="/wedding/inquiry" className="weddings-cta weddings-cta--primary">
              Bridal inquiry
            </Link>
            <a href="#book" className="weddings-cta">How to book</a>
          </div>
        </section> */}

        {/* <section className="weddings-letter" id="letter" aria-labelledby="letter-heading">
          <div className="weddings-letter-inner">
            <h2 id="letter-heading" className="weddings-letter-title">
              A letter to you, beautiful bride
            </h2>
            <p className="weddings-letter-hook">You found your way here for a reason.</p>
            <div className="weddings-letter-body">
              <p>
                Maybe someone you love whispered my name across a table at a wedding where tears were cried and champagne
                was spilled and the bride looked so impossibly, breathtakingly herself — and you thought: I want that. That
                feeling. That magic.
              </p>
              <p>
                Or maybe you have been quietly searching, scrolling through look after look, wondering if anyone will
                truly see you — not just the dress, not the theme, not the colour palette — but you. The woman behind the
                veil. The one who has been dreaming of this day longer than she can remember.
              </p>
              <p className="weddings-letter-emphasis">I see you.</p>
              <p>
                My name is Ekay, and for years I have had the extraordinary privilege of sitting across from women on the
                most sacred morning of their lives. I have held brushes with steady hands while brides trembled with joy.
                I have whispered quiet reassurances while nervous mothers dabbed their eyes. I have watched women look into
                the mirror — sometimes for the very first time — and see a bride staring back.
              </p>
              <p>
                What I do is not simply makeup. It is presence. It is intention. It is the art of revealing the woman who
                was always there — luminous, worthy, and extraordinarily beautiful.
              </p>
              <p>
                Everything in this guide has been built around one belief: luxury is not just about price — it is about
                how you feel. From the moment you reach out to the moment I press the final setting spray onto your skin,
                I want you to feel chosen, cherished, and completely at ease.
              </p>
              <p className="weddings-letter-outro">
                You are safe here. You are welcome here. And you are about to be absolutely radiant.
              </p>
              <footer className="weddings-letter-signature">
                <p className="weddings-letter-signoff">With love and golden brushes,</p>
                <p className="weddings-letter-name">Ekay</p>
                <p className="weddings-letter-role">Lead Bridal Makeup Artist · Ziva by Ekay</p>
              </footer>
            </div>
          </div>
        </section> */}

        <section className="weddings-note" id="note" aria-labelledby="note-heading">
          <div className="weddings-note-inner">
            <div className="weddings-note-image-wrap weddings-note-image-wrap--video">
              <video
                className="weddings-note-video"
                src="/ekay/bridal.MP4"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Ekay Gabriel, bridal makeup artist"
              />
            </div>
            <div className="weddings-note-copy">
              <header className="weddings-note-header">
                <div className="weddings-note-header-icon" aria-hidden>
                  <IoIosHeart size={28} />
                </div>
                <div className="weddings-note-header-text">
                  <p className="weddings-note-eyebrow">From the artist</p>
                  <h2 id="note-heading" className="weddings-note-title">
                    A personal note from Ekay
                  </h2>
                </div>
              </header>
              <p>Welcome, Bride.</p>
              <p>
                I started this journey with one belief, that every bride, in every skin tone, every shape and size, deserves
                to feel like the most beautiful version of herself on her wedding day.
              </p>
              <p>
                Not a version curated for the camera. But the version of yourself you have always known was inside you.
              </p>
              <p>You, my bride, deserve an experience that is calm and uniquely yours.</p>
              <p>
                I have spent years perfecting my bridal craft, mastering the balance between longevity and luminosity, and
                through all of it, carrying you in my heart. The bride I had not yet met. The face I had not yet touched.
              </p>
              <p>
                So that when you finally sit in my chair, you do not have to worry about a single thing, except the love
                waiting for you at the end of the aisle.
              </p>
              <p>
                Your wedding is not just a booking on our calendar. It is a covenant we make with you, to give you our full
                attention, our full heart, and our full artistry. Always.
              </p>
              <p>
                I cannot wait to meet you. To hear your vision, your story, and the tiny details that make your love
                completely your own.
              </p>
              <p>I Do Starts Here.</p>
              <footer className="weddings-note-footer">
                <p className="weddings-note-signoff">— Ekay Gabriel</p>
              </footer>
            </div>
          </div>
        </section>

        <section className="weddings-tiers" id="tiers" aria-labelledby="tiers-heading">
          <span className="weddings-tiers-icon" aria-hidden>◆</span>
          <h2 id="tiers-heading" className="weddings-section-title weddings-section-title--rate-card">
            Service tiers &amp; investment
          </h2>
          <p className="weddings-tiers-intro">
            Each tier has been thoughtfully designed to meet you exactly where you are.
          </p>
          <div className="weddings-tier-stack">
            {SERVICE_TIERS.map((tier, index) => {
              const displayTitle =
                typeof tier.name === "string" && tier.name.includes("(")
                  ? tier.name.split("(")[0].trim()
                  : tier.name;
              const { src: imgSrc, alt: imgAlt } = getWeddingsTierCardMedia(tier, displayTitle);
              const mirrorLayout = index % 2 === 1;

              return (
                <article
                  key={tier.id}
                  className={`weddings-tier-card weddings-tier-card--split${
                    mirrorLayout ? " weddings-tier-card--split-mirror" : ""
                  }${tier.highlight ? " weddings-tier-card--featured" : ""}`}
                >
                  <div className="weddings-tier-card-media">
                    <img
                      src={imgSrc}
                      alt={imgAlt}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = "/site-icon.png";
                      }}
                    />
                  </div>
                  <div className="weddings-tier-card-main">
                    {tier.highlight ? (
                      <span className="weddings-tier-ribbon weddings-tier-ribbon--split">Most booked</span>
                    ) : null}
                    <div className="weddings-tier-card-body">
                      <p className="weddings-tier-card-roman" aria-hidden>
                        {tier.roman}
                      </p>
                      <h3 className="weddings-tier-card-title">{displayTitle}</h3>
                      <p className="weddings-tier-card-kicker">{tier.subtitle}</p>
                      {tier.description ? (
                        <div className="weddings-tier-card-copy">
                          {tier.description.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                        </div>
                      ) : null}
                      {tier.bullets?.length ? (
                        <ul className="weddings-tier-list weddings-tier-list--split">
                          {tier.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="weddings-tier-card-foot">
                      <p
                        className="weddings-tier-card-invest-line"
                        aria-label={`Investment: ${tier.investment}`}
                      >
                        <span className="weddings-tier-card-invest-prefix">Investment</span>
                        <span className="weddings-tier-card-invest-sep" aria-hidden>
                          :{" "}
                        </span>
                        <span className="weddings-tier-card-invest-amount">{tier.investment}</span>
                      </p>
                      {tier.investmentNote ? (
                        <p className="weddings-tier-card-invest-note">{tier.investmentNote}</p>
                      ) : null}
                      <Link to={`/wedding/inquiry?tier=${encodeURIComponent(tier.id)}`} className="weddings-tier-card-cta">
                        Book package
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="weddings-addons" id="addons" aria-labelledby="addons-heading">
          <span className="weddings-tiers-icon" aria-hidden>◆</span>
          <h2 id="addons-heading" className="weddings-section-title weddings-section-title--rate-card weddings-section-title--tier-name">
            Add-ons
          </h2>
          <p className="weddings-tiers-intro">
            Enhance your bridal experience with additional services.
          </p>
          <div className="weddings-addons-list" role="list">
            {WEDDINGS_ADD_ONS.map((a) => (
              <div key={a.id} className="weddings-addon" role="listitem">
                <p className="weddings-addon-title">{a.title}</p>
                <p className="weddings-addon-price">{a.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="weddings-experience" id="experience" aria-labelledby="experience-heading">
          <div className="weddings-experience-rule" aria-hidden />
          <h2 id="experience-heading" className="weddings-section-title weddings-section-title--rate-card weddings-section-title--tier-name">
            What to expect
          </h2>
          <p className="weddings-experience-sublead">What every bride receives, without exception</p>
          <ul className="weddings-experience-list">
            {ZIVA_EXPERIENCE_BULLETS.map((text) => (
              <li key={text} className="weddings-experience-item">{text}</li>
            ))}
          </ul>
          {/* <div className="weddings-products">
            <h3 className="weddings-products-heading">Products I work with include:</h3>
            <ul className="weddings-products-list">
              <li>
                <span className="weddings-products-label">Makeup brands</span>
                <span className="weddings-products-text">{ZIVA_PRODUCTS.makeupBrands}</span>
              </li>
              <li>
                <span className="weddings-products-label">Specialty equipment</span>
                <span className="weddings-products-text">{ZIVA_PRODUCTS.equipment}</span>
              </li>
              <li>
                <span className="weddings-products-label">Skin prep tools</span>
                <span className="weddings-products-text">{ZIVA_PRODUCTS.skinPrep}</span>
              </li>
            </ul>
          </div> */}
          <div className="weddings-experience-rule" aria-hidden />
        </section>

        {/* <section className="weddings-gallery" aria-label="Bridal gallery">
          <div className="weddings-gallery-grid">
            {galleryImages.map((img) => (
              <div key={img.id} className="weddings-gallery-item">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section> */}

        <section className="weddings-book" id="book" aria-labelledby="book-heading">
          <div className="weddings-book-inner">
            {/*
            <div className="weddings-book-intro">
              <div className="weddings-book-rule" aria-hidden />
              <h2 id="book-heading" className="weddings-section-title">How to book your date</h2>
              <p className="weddings-book-lead">
                A clear path from first hello to your wedding morning—six simple steps.
              </p>
            </div>
            <div className="weddings-book-panel">
              <ol className="weddings-book-steps" aria-label="Steps to book">
                {BOOKING_STEPS.map((s) => (
                  <li key={s.id} className="weddings-book-step">
                    <span className="weddings-book-step-num" aria-hidden>
                      {s.step}
                    </span>
                    <div className="weddings-book-step-body">
                      <h3 className="weddings-book-step-title">{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            */}
            <div className="weddings-book-cta">
              <Link to="/wedding/inquiry" className="weddings-cta weddings-cta--primary">
                Start your bridal inquiry
              </Link>
              {/* <Link to="/ekay/contact" className="weddings-cta">
                Questions? Contact us
              </Link> */}
            </div>
          </div>
        </section>

        <section className="weddings-legal-triggers" id="legal-documents" aria-labelledby="legal-triggers-heading">
          <h2 id="legal-triggers-heading" className="weddings-section-title">
            Client service agreement &amp; terms
          </h2>
          <p className="weddings-legal-triggers-intro">
            Read the full summaries here. Your signed contract may include additional dates, fees, and specifics.
          </p>
          <div className="weddings-legal-triggers-row">
            <button
              type="button"
              className="weddings-legal-open-btn"
              onClick={() => setLegalModal("agreement")}
            >
              View client service agreement
            </button>
            <button
              type="button"
              className="weddings-legal-open-btn"
              onClick={() => setLegalModal("terms")}
            >
              View terms &amp; conditions
            </button>
            <button
              type="button"
              className="weddings-legal-open-btn"
              onClick={() => setLegalModal("travel")}
            >
              View travel terms
            </button>
            <button
              type="button"
              className="weddings-legal-open-btn"
              onClick={() => setLegalModal("payment")}
            >
              View payment details
            </button>
          </div>
        </section>

        {legalModal ? (
          <div
            className="weddings-modal-backdrop"
            role="presentation"
            onClick={() => setLegalModal(null)}
          >
            <div
              className="weddings-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={
                legalModal === "agreement"
                  ? "weddings-modal-agreement-title"
                  : legalModal === "terms"
                    ? "weddings-modal-terms-title"
                    : legalModal === "travel"
                      ? "weddings-modal-travel-title"
                      : "weddings-modal-payment-title"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="weddings-modal-header">
                {legalModal === "agreement" ? (
                  <h2 id="weddings-modal-agreement-title" className="weddings-modal-title">
                    Client service agreement
                  </h2>
                ) : legalModal === "terms" ? (
                  <h2 id="weddings-modal-terms-title" className="weddings-modal-title">
                    Makeup booking policy
                  </h2>
                ) : legalModal === "travel" ? (
                  <h2 id="weddings-modal-travel-title" className="weddings-modal-title">
                    Travel terms
                  </h2>
                ) : (
                  <h2 id="weddings-modal-payment-title" className="weddings-modal-title">
                    Payment details
                  </h2>
                )}
                <button
                  type="button"
                  className="weddings-modal-close"
                  onClick={() => setLegalModal(null)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="weddings-modal-body">
                {legalModal === "agreement" ? (
                  <>
                    <p className="weddings-legal-intro weddings-legal-intro--modal">
                      The following reflects the agreement provided with your booking. Your signed contract may include
                      additional dates, fees, and specifics.
                    </p>
                    <div className="weddings-legal-box weddings-legal-box--modal" tabIndex={0}>
                      <p className="weddings-legal-contract-intro">{CLIENT_SERVICE_AGREEMENT.intro}</p>
                      {CLIENT_SERVICE_AGREEMENT.sections.map((sec) => (
                        <div key={sec.id} className="weddings-legal-section">
                          <h3 className="weddings-legal-section-title">{sec.title}</h3>
                          {sec.paragraphs?.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                          {sec.list && (
                            <ul className="weddings-legal-list">
                              {sec.list.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                          {sec.afterList && <p>{sec.afterList}</p>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : legalModal === "terms" ? (
                  <>
                    <p className="weddings-legal-intro weddings-legal-intro--modal">
                      MAKEUP BOOKING POLICY
                    </p>
                    <div className="weddings-legal-box weddings-legal-box--modal" tabIndex={0}>
                      {TERMS_AND_CONDITIONS.map((term) => (
                        <div key={term.id} className="weddings-legal-term">
                          <h3 className="weddings-legal-term-title">{term.title}</h3>
                          {term.paragraphs?.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                          {term.items ? (
                            <ul className="weddings-legal-list">
                              {term.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                      <p className="weddings-legal-contact">{TERMS_AND_CONDITIONS_ACKNOWLEDGEMENT}</p>
                      <p className="weddings-legal-contact">
                        This page does not replace your signed contract. For questions, contact{" "}
                        <a href="mailto:sooziva@gmail.com">sooziva@gmail.com</a>.
                      </p>
                    </div>
                  </>
                ) : legalModal === "travel" ? (
                  <>
                    <p className="weddings-legal-intro weddings-legal-intro--modal">
                      Travel terms apply when your booking requires travel outside Accra or when logistics require
                      accommodation or multi-day service. Your final travel quote is confirmed in writing.
                    </p>
                    <div className="weddings-legal-box weddings-legal-box--modal" tabIndex={0}>
                      {TRAVEL_TERMS.map((term) => (
                        <div key={term.id} className="weddings-legal-term">
                          <h3 className="weddings-legal-term-title">{term.title}</h3>
                          <p>{term.text}</p>
                        </div>
                      ))}
                      <p className="weddings-legal-contact">
                        This page does not replace your signed contract. For questions, contact{" "}
                        <a href="mailto:sooziva@gmail.com">sooziva@gmail.com</a>.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="weddings-payment">
                    <p className="weddings-legal-intro weddings-legal-intro--modal">
                      Use the details below to complete your payment. Tap the button to copy everything.
                    </p>
                    <button type="button" className="weddings-payment-btn" onClick={copyPaymentDetails}>
                      {paymentCopied ? "Payment details copied" : "Copy payment details"}
                    </button>
                    <div className="weddings-payment-card" aria-label="Payment details">
                      <div className="weddings-payment-block">
                        <h3>Stanbic Bank</h3>
                        <p>
                          <strong>Ziva by Ekay Ltd</strong>
                          <br />
                          <span className="weddings-payment-line">
                            <span>Acc No: 0150445111000</span>
                            <button
                              type="button"
                              className="weddings-payment-copy"
                              onClick={() => copyText("0150445111000", "bank")}
                              aria-label="Copy bank account number"
                              title="Copy"
                            >
                              <IoIosCopy size={18} />
                            </button>
                          </span>
                          <br />
                          Branch: East Legon
                        </p>
                      </div>
                      <div className="weddings-payment-block">
                        <h3>Mobile Money</h3>
                        <p>
                          <span className="weddings-payment-line">
                            <span>MTN: 0247584910</span>
                            <button
                              type="button"
                              className="weddings-payment-copy"
                              onClick={() => copyText("0247584910", "mtn")}
                              aria-label="Copy MTN number"
                              title="Copy"
                            >
                              <IoIosCopy size={18} />
                            </button>
                          </span>
                          <br />
                          Account: <strong>Ziva by Ekay Ltd</strong>
                        </p>
                        {paymentCopiedField ? (
                          <p className="weddings-payment-copied" role="status">
                            {paymentCopiedField === "bank" ? "Bank number copied" : "MTN number copied"}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <section className="weddings-signature" id="signature" aria-labelledby="signature-heading">
          <h2 id="signature-heading" className="weddings-section-title">Agreement acknowledgement</h2>
          <p className="weddings-section-lead">
            For active bookings, you will receive a formal contract. Use this section to acknowledge you have read the
            summaries above.
          </p>
          {sigSubmitted ? (
            <p className="weddings-sig-success" role="status">
              Thank you, {sigForm.name.trim()}. Your acknowledgement has been recorded for this session. We&apos;ll follow up by email for your official documents.
            </p>
          ) : (
            <form className="weddings-sig-form" onSubmit={handleSignatureSubmit} noValidate>
              <label className="weddings-sig-field">
                <span className="weddings-sig-label">Full legal name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={sigForm.name}
                  onChange={(e) => setSigForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>
              <label className="weddings-sig-field">
                <span className="weddings-sig-label">Date</span>
                <input
                  type="text"
                  name="date"
                  placeholder="MM / DD / YYYY"
                  value={sigForm.date}
                  onChange={(e) => setSigForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </label>
              <label className="weddings-sig-field">
                <span className="weddings-sig-label">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={sigForm.email}
                  onChange={(e) => setSigForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </label>
              <label className="weddings-sig-check">
                <input
                  type="checkbox"
                  checked={sigForm.agreed}
                  onChange={(e) => setSigForm((f) => ({ ...f, agreed: e.target.checked }))}
                />
                <span>
                  I have read the client service agreement summary and terms on this page and understand that my binding
                  agreement will be the signed contract provided by Ziva by Ekay.
                </span>
              </label>
              <button type="submit" className="weddings-cta weddings-cta--primary weddings-cta--block weddings-sig-submit">
                {sigSending ? "Sending..." : "Submit acknowledgement"}
              </button>
              {sigError ? (
                <p className="weddings-sig-error" role="status">
                  {sigError}
                </p>
              ) : null}
            </form>
          )}
        </section>

        <section className="weddings-testimonials" id="testimonials" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="weddings-section-title">What our brides say</h2>
          <div className="weddings-testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.id} className="weddings-quote">
                <p className="weddings-quote-text">&ldquo;{t.quote}&rdquo;</p>
                <footer className="weddings-quote-meta">
                  <cite className="weddings-quote-name">{t.name}</cite>
                  <span className="weddings-quote-detail">{t.detail}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="weddings-faq" id="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="weddings-section-title">Frequently asked questions</h2>
          <div className="weddings-faq-list">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className="weddings-faq-item">
                  <button
                    type="button"
                    className="weddings-faq-q"
                    aria-expanded={isOpen}
                    id={`faq-btn-${index}`}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    {item.q}
                    <span className="weddings-faq-icon" aria-hidden> {isOpen ? "−" : "+"}</span>
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    className="weddings-faq-a"
                    hidden={!isOpen}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="weddings-gallery" id="gallery" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="weddings-section-title">Gallery</h2>
          <div className="weddings-gallery-grid" aria-hidden="true">
            {galleryImages.slice(0, 6).map((img) => (
              <div key={img.id} className="weddings-gallery-item">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = "/site-icon.png";
                  }}
                />
              </div>
            ))}
          </div>

          <div className="weddings-gallery-marquee" aria-label="Bridal gallery marquee">
            <div className="weddings-gallery-marquee-track">
              {galleryImages
                .slice(0, 6)
                .concat(galleryImages.slice(0, 6))
                .map((img, idx) => (
                  <div key={`${img.id}-${idx}`} className="weddings-gallery-marquee-item">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = "/site-icon.png";
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="weddings-download" aria-label="Download weddings PDF">
          <a
            className="weddings-cta weddings-cta--primary weddings-cta--block"
            href="/api/weddings-pdf?path=/wedding&mode=a4&sections=hero,note,tiers,addons,experience,book,testimonials,gallery"
            target="_blank"
            rel="noreferrer"
          >
            Download PDF
          </a>
        </section>
        </div>
      </main>

      {/* footer removed */}
    </div>
  );
};

export default Weddings;

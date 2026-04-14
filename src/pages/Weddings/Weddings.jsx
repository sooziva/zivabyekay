import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart, IoIosHeart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
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
    name: "Céleste (package) - 1 day affair ",
    subtitle: "2hr 30mins on site",
    investment: "Inquire",
    investmentNote: "Starting investment",
    description: [
    
      "The Céleste package is a bridal experience built on the belief that the most beautiful version of you already exists.",
      "Your skin, your features, your energy, that’s where this look begins.",
      "Skin is deeply prepped, massage and nourished for a finish that’s luminous, and alive. From there, the look is yours, finalizing with a soft and timeless finish",
    ],
  },
  {
    id: "la-mariee",
    roman: "II",
    name: "La Mariée (package) - 2 events in 1 day",
    subtitle: "2hr for  each event",
    investment: "Inquire",
    investmentNote: "Starting investment",
    description: [
      "enjoy the luxury of 2 unique bridal looks tailored to each segment of your big day. Starting off with an in-depth skin prep for a flawless canvas. Before I proceed to create a luxurious makeup look that celebrates your unique style and personality.",
      "From rich, saturated tones to soft, understated finishes, every look is tailored around your vision. As you move from your traditional ceremony into your white wedding, I’ll refresh and elevate your look so you feel effortless and radiant from the aisle to the very last dance. Promising a picture perfect finish.",
    ],
  },
  {
    id: "ivoire (package) - 2 separate affairs",
    roman: "III",
    name: "Ivoire",
    subtitle: "2hr 30 mins per day",
    investment: "Inquire",
    investmentNote: "Starting investment",
    description: [
      "Two days, two looks  each one detailed, intentional, and entirely yours.",
      "Day One — Traditional Ceremony",
      "Your traditional look is crafted to honour the occasion and complement the richness of your Kente. Bold, radiant, and deeply personal. Making sure you look regal and Queenly.",
      "Day Two — White Wedding",
      "As you walk down the aisle, your look shifts into something softer, luminous, romantic, and quietly breathtaking. Elegance without effort. Beauty that stays with you from the first kiss to the final dance.",
    ],
  },
  {
    id: "grand-affair",
    roman: "IV",
    name: "Grand affair",
    subtitle: "full day package",
    investment: "14,000 cedis",
    investmentNote: "Investment",
    description: [
      "Your events deserve more than a single look, you deserve an entire experience. The Grand Affair is a full-day package designed for the bride who wants her  beauty to be celebrated in different tones, looks that evolves alongside every moment of her celebration. From the first look to the final hour, I’m on-site with you refreshing, adjusting, and creating with no creative limits and no corners cut. This closes all future bookings, so the day is completely yours.",
      "What’s included:",
    ],
    bullets: [
      "Up to 8 hours of on-site presence",
      "Multiple curated looks across your event",
      "A dedicated team on standby for touch-ups and beauty emergencies throughout the day",
    ],
  },
  {
    id: "couture-day",
    roman: "V",
    name: "The Couture Day",
    subtitle: "The Premium Experience",
    investment: "$2,200",
    investmentNote: "When only exceptional will do",
    bullets: [
      "Everything in The Grand Affair",
      "Dedicated second makeup artist on the team",
      "Bridal trial session fully included",
      "Full editorial glam — no limits on creativity",
      "Pre-application hydration treatment & facial massage",
      "Bespoke look curation board created just for you",
      "Up to 10 hours on-site",
    ],
  },
  {
    id: "empress",
    roman: "VI",
    name: "The Empress",
    subtitle: "All-Day Luxury",
    investment: "Inquire",
    investmentNote: "Quoted for your celebration",
    bullets: [
      "Everything in The Couture Day",
      "Artist on-site from preparation through to reception",
      "Ceremony & reception look change for the bride",
      "Custom foundation blend — yours to keep forever",
      "Bridal beauty emergency kit left with client",
    ],
  },
];

const TIERS_BG_IMAGES = ["/ekay/bridal2.JPG", "/ekay/bridal1.JPG"];

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Ekay listened to exactly what I wanted and made me feel like the best version of myself. Calm, professional, and somehow made a hectic morning feel peaceful.",
    name: "Sarah M.",
    detail: "Summer wedding",
  },
  {
    id: 2,
    quote:
      "My makeup lasted through tears, heat, and hours of dancing. The trial gave me so much confidence—I knew I was in good hands.",
    name: "Jessica L.",
    detail: "Outdoor ceremony",
  },
  {
    id: 3,
    quote:
      "From first email to the last touch-up, everything felt luxury without being stuffy. I’ve never felt more beautiful.",
    name: "Amara K.",
    detail: "City wedding",
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
    id: "booking",
    title: "Booking confirmation",
    text:
      "Your date is only confirmed upon receipt of a signed agreement AND retainer payment. An unsigned booking is not a confirmed booking.",
  },
  {
    id: "trials",
    title: "Trial sessions",
    text:
      "Trials are conducted 4–8 weeks before the wedding. They are included in Tier V and Tier VI; available as an add-on for Tiers I–IV at $150.",
  },
  {
    id: "scheduling",
    title: "Group scheduling",
    text:
      "The Client is responsible for ensuring all bridal party members are present at their allotted times. Delays caused by late sitters may result in incomplete services without refund.",
  },
  {
    id: "products",
    title: "Product requests",
    text:
      "Clients wishing to have specific products used must provide them no later than 5 days before the wedding and in advance of any trial.",
  },
  {
    id: "space",
    title: "Preparation space",
    text:
      "Out of respect for the artistry process, only bridal party members and immediate family are asked to be present during application.",
  },
  {
    id: "pricing",
    title: "Pricing",
    text:
      "Quoted prices are guaranteed for 30 days from issue. Confirmed bookings with paid retainers lock in the quoted price entirely.",
  },
  {
    id: "gratuity",
    title: "Gratuity",
    text:
      "Gratuity is not included and is entirely at the Client’s discretion. When offered, it is received with deep gratitude.",
  },
  {
    id: "law",
    title: "Governing law",
    text:
      "This agreement is governed by the laws of [your state / country]. Disputes shall be resolved through good-faith mediation before any legal proceedings are initiated.",
  },
  {
    id: "entire",
    title: "Entire agreement",
    text:
      "This document and the attached quote constitute the entire agreement between both parties, superseding all prior discussions.",
  },
];

const ZIVA_EXPERIENCE_BULLETS = [
  "An artist who genuinely loves what she does, and whose work shows it in every brushstroke",
  "A thorough pre-wedding consultation,your vision, your skin, your story, all understood",
  "Full discretion, warmth, and calm professionalism from first contact to final photograph",
  "Premium, skin loving products from the world's most coveted luxury beauty houses",
  "A clean, curated setup that brings the feel of a high-end beauty suite to your space",
  "Impeccable time management, your schedule is protected, always",
 
];

const ZIVA_PRODUCTS = {
  makeupBrands:
    "Charlotte Tilbury, Armani Beauty, Pat McGrath, La Mer, NARS, Kevyn Aucoin, Huda Beauty, Fenty Beauty",
  equipment: "Airbrush systems by Dinair & Temptu.",
  skinPrep: "Jade rollers, gua sha, LED wand, hydrating masks.",
};

const Weddings = () => {
  const galleryImages = [
    { id: 1, src: "/ekay/0T2A2099.JPEG", alt: "Bridal makeup by Ekay" },
    { id: 2, src: "/ekay/0T2A2123.JPEG", alt: "Bridal look" },
    { id: 3, src: "/ekay/IMG_9388.JPG", alt: "Wedding beauty" },
    { id: 4, src: "/ekay/IMG_7714.JPG", alt: "Bridal glamour" },
    { id: 5, src: "/ekay/IMG_7871.JPG", alt: "Ekay bridal" },
    { id: 6, src: "/ekay/IMG_7841.JPG", alt: "Wedding day makeup" },
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

  const handleSignatureSubmit = (e) => {
    e.preventDefault();
    if (!sigForm.agreed || !sigForm.name.trim() || !sigForm.date.trim()) return;
    setSigSubmitted(true);
  };

  return (
    <div className="weddings-page">
      <a href="#main-content" className="weddings-skip-link">
        Skip to content
      </a>
      <Link to="/beauty-store" className="kellsie-top-banner">
        Get Access To My Free Guides→
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
          <Link to="/ekay/weddings" className="ekay-nav-link active">Weddings</Link>
          <Link to="/education" className="ekay-nav-link">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main id="main-content" className="weddings-main" tabIndex={-1}>
        {/* <section className="weddings-intro" aria-label="Weddings introduction">
          <h1 className="weddings-title">Weddings</h1>
          <p className="weddings-lead">
            Ekay and her team are available for engagements, elopements, weddings, and milestone celebrations—where
            natural, refined beauty meets the calm you deserve on your day.
          </p>
          <div className="weddings-cta-group">
            <Link to="/ekay/weddings/inquiry" className="weddings-cta weddings-cta--primary">
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
            <div className="weddings-note-image-wrap">
              <img src="/ekay/bridal5.jpg" alt="Ekay Gabriel, bridal makeup artist" loading="lazy" />
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
              <p>
              I started this journey with the believe that every woman,on every skin tone, in every shape and size
              deserves to feel like the most beautiful version of herself on her wedding day. Not a version curated for the camera. 
              but Her, Alive. Glowing. Undeniable.

              </p>
              <p>
              I have spent years perfecting my bridalcraft, studying skin, and mastering the balance between longevity and luminosity 
              so that when you sit in my chair, you do not have to worry about anything except the love waiting for you at the end of the aisle. we take on a limited number of weddings each year. 
              Intentionally. Because your wedding is not just a booking on the calendar to us,it is a covenant we make with you. our full attention. our full heart. and our full artistry. Always.


              </p>
              <p>
              I cannot wait to meet you, to hear about your vision, your story, the tiny details that make your love completely your own.
              </p>

              <p>Thank you for considering us. It is a privilege we do not take lightly, not for a single moment.</p>
              <footer className="weddings-note-footer">
                <p className="weddings-note-signoff">— Ekay Gabriel</p>
              </footer>
            </div>
          </div>
        </section>

        <section className="weddings-experience" id="experience" aria-labelledby="experience-heading">
          <div className="weddings-experience-rule" aria-hidden />
          <h2 id="experience-heading" className="weddings-section-title weddings-section-title--rate-card">
            The Ziva experience
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

        <section className="weddings-tiers" id="tiers" aria-labelledby="tiers-heading">
          <span className="weddings-tiers-icon" aria-hidden>◆</span>
          <h2 id="tiers-heading" className="weddings-section-title weddings-section-title--rate-card">
            Service tiers &amp; investment
          </h2>
          <p className="weddings-tiers-intro">
            Each tier has been thoughtfully designed to meet you exactly where you are.
          </p>
          <div className="weddings-tiers-groups">
            {[0, 1].map((groupIndex) => {
              const start = groupIndex * 3;
              const tiers = SERVICE_TIERS.slice(start, start + 3);
              if (!tiers.length) return null;

              const bg = TIERS_BG_IMAGES[groupIndex % TIERS_BG_IMAGES.length];

              return (
                <div
                  key={`tier-group-${groupIndex}`}
                    className="weddings-tiers-group weddings-tiers-group--glass"
                  style={{ "--tiers-bg": `url("${bg}")` }}
                >
                  <div className="weddings-tiers-grid">
                    {tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`weddings-tier-card${tier.highlight ? " weddings-tier-card--featured" : ""}`}
                      >
                        {tier.highlight && <span className="weddings-tier-ribbon">Most booked</span>}
                        <div className="weddings-tier-header">
                          <span className="weddings-tier-roman">{tier.roman}</span>
                          <div className="weddings-tier-titles">
                            <h3 className="weddings-tier-name">{tier.name}</h3>
                            <p className="weddings-tier-subtitle">{tier.subtitle}</p>
                          </div>
                        </div>
                        {tier.description ? (
                          <>
                            <div className="weddings-tier-desc">
                              {tier.description.map((para) => (
                                <p key={para}>{para}</p>
                              ))}
                            </div>
                            {tier.bullets?.length ? (
                              <ul className="weddings-tier-list">
                                {tier.bullets.map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            ) : null}
                          </>
                        ) : (
                          <ul className="weddings-tier-list">
                            {tier.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                        <div className="weddings-tier-price-block">
                          <p className="weddings-tier-investment">{tier.investment}</p>
                          <p className="weddings-tier-investment-note">{tier.investmentNote}</p>
                        </div>
                        <Link
                          to={`/ekay/weddings/inquiry?tier=${encodeURIComponent(tier.id)}`}
                          className="weddings-cta weddings-cta--block"
                        >
                          Inquire for this tier
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/*
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
        */}

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
              <Link to="/ekay/weddings/inquiry" className="weddings-cta weddings-cta--primary">
                Start your bridal inquiry
              </Link>
              {/* <Link to="/ekay/contact" className="weddings-cta">
                Questions? Contact us
              </Link> */}
            </div>
          </div>
        </section>

        <section className="weddings-legal" id="agreement" aria-labelledby="agreement-heading">
          <h2 id="agreement-heading" className="weddings-section-title">Client service agreement</h2>
          <p className="weddings-legal-intro">
            The following reflects the agreement provided with your booking. Your signed contract may include additional
            dates, fees, and specifics.
          </p>
          <div className="weddings-legal-box" tabIndex={0}>
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
        </section>

        <section className="weddings-legal" id="terms" aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="weddings-section-title">Terms &amp; conditions</h2>
          <p className="weddings-legal-intro">
            Additional terms that apply together with your client service agreement and quote.
          </p>
          <div className="weddings-legal-box" tabIndex={0}>
            {TERMS_AND_CONDITIONS.map((term) => (
              <div key={term.id} className="weddings-legal-term">
                <h3 className="weddings-legal-term-title">{term.title}</h3>
                <p>{term.text}</p>
              </div>
            ))}
            <p className="weddings-legal-contact">
              This page does not replace your signed contract. For questions, contact{" "}
              <a href="mailto:hello@zivabyekay.com">hello@zivabyekay.com</a>.
            </p>
          </div>
        </section>

        <section className="weddings-signature" id="signature" aria-labelledby="signature-heading">
          <h2 id="signature-heading" className="weddings-section-title">Agreement acknowledgement</h2>
          <p className="weddings-section-lead">
            For active bookings, you will receive a formal contract. Use this section to acknowledge you have read the
            summaries above (demo only—your official signature happens on the contract we send you).
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
                <span className="weddings-sig-label">Email (optional)</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={sigForm.email}
                  onChange={(e) => setSigForm((f) => ({ ...f, email: e.target.value }))}
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
                Submit acknowledgement
              </button>
            </form>
          )}
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
      </main>

      <footer className="weddings-footer">
        <Link to="/sooziva" className="weddings-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Transition(Weddings);

import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import "../KellsieBain/KellsieBain.css";
import "./EMA.css";

const EMA = () => {
  const galleryImages = [
    { id: 1, src: "/ekay/IMG_8627.JPG", alt: "EMA program" },
    { id: 2, src: "/ekay/IMG_8628.JPG", alt: "EMA workshop" },
    { id: 3, src: "/ekay/IMG_8634.JPG", alt: "EMA masterclass" },
    { id: 4, src: "/ekay/IMG_8635.JPG", alt: "EMA training" },
    { id: 5, src: "/ekay/IMG_8636.JPG", alt: "EMA session" },
    { id: 6, src: "/ekay/IMG_8637.JPG", alt: "EMA program" },
    { id: 7, src: "/ekay/IMG_8638.JPG", alt: "EMA workshop" },
    { id: 8, src: "/ekay/IMG_8639.JPG", alt: "EMA masterclass" },
    { id: 9, src: "/ekay/IMG_9335.JPG", alt: "EMA training" },
  ];

  return (
    <div className="ema-page">
      <Link to="/education/resources" className="kellsie-top-banner">
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
          <Link to="/sooziva/wedding" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link active">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="ema-main">
        <section className="ema-hero" aria-label="EMA Introduction">
          <h1 className="ema-title">EMA Expert Makeup Academy</h1>
          <p className="ema-lead">
            Elevate your artistry with professional makeup education designed for aspiring and established artists alike.
          </p>
        </section>

        <section className="ema-content" aria-label="About the Academy">
          <div className="ema-content-inner">
            <div className="ema-image-wrap">
              <img src="/ekay/IMG_9339.JPG" alt="EMA Expert Makeup Academy" />
            </div>
            <div className="ema-text">
              <h2 className="ema-heading">The Academy</h2>
              <p className="ema-body">
                EMA (Expert Makeup Academy) is Ekay's flagship education platform, offering structured programs that blend technical artistry with business acumen. Whether you're new to the industry or looking to refine your skills, EMA provides the tools, mentorship, and community to help you thrive.
              </p>
              <p className="ema-body">
                From foundational techniques to advanced bridal and editorial work, our curriculum is built on real-world experience and designed to accelerate your growth as a professional makeup artist.
              </p>
              <div className="ema-cta-group">
                <Link to="/education" className="ema-cta">Explore Education</Link>
                <Link to="/ekay/contact" className="ema-cta ema-cta-outline">Get in Touch</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="ema-calendar" aria-label="Class Calendar">
          <h2 className="ema-section-title">Class Calendar</h2>
          <p className="ema-section-lead">Upcoming EMA sessions and workshops</p>
          <div className="ema-calendar-grid">
            <div className="ema-calendar-month">
              <h3 className="ema-calendar-month-name">January 2025</h3>
              <div className="ema-calendar-dates">
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">12</span>
                  <span className="ema-calendar-label">Bridal Masterclass</span>
                </div>
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">18</span>
                  <span className="ema-calendar-label">Editorial Techniques</span>
                </div>
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">25</span>
                  <span className="ema-calendar-label">Business Foundations</span>
                </div>
              </div>
            </div>
            <div className="ema-calendar-month">
              <h3 className="ema-calendar-month-name">February 2025</h3>
              <div className="ema-calendar-dates">
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">8</span>
                  <span className="ema-calendar-label">Advanced Bridal</span>
                </div>
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">15</span>
                  <span className="ema-calendar-label">Skincare & Prep</span>
                </div>
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">22</span>
                  <span className="ema-calendar-label">Experience Program</span>
                </div>
              </div>
            </div>
            <div className="ema-calendar-month">
              <h3 className="ema-calendar-month-name">March 2025</h3>
              <div className="ema-calendar-dates">
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">8</span>
                  <span className="ema-calendar-label">Career Intensive</span>
                </div>
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">15</span>
                  <span className="ema-calendar-label">Color Theory Workshop</span>
                </div>
                <div className="ema-calendar-day">
                  <span className="ema-calendar-date">29</span>
                  <span className="ema-calendar-label">Experience Program</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ema-calendar-cta">
            <Link to="/ekay/contact" className="ema-cta">View Full Schedule</Link>
          </div>
        </section>

        <section className="ema-tiers" aria-label="Program Tiers">
          <h2 className="ema-section-title">Program Tiers</h2>
          <p className="ema-section-lead">Three pathways to grow your artistry</p>
          <div className="ema-tiers-grid">
            <div className="ema-tier-card ema-tier-1">
              <span className="ema-tier-badge">Tier 1</span>
              <h3 className="ema-tier-title">Career Defining Classes</h3>
              <p className="ema-tier-desc">
                Intensive programs designed to accelerate your trajectory into professional makeup artistry. Build foundational technique, industry knowledge, and the confidence to launch or elevate your career.
              </p>
              <ul className="ema-tier-list">
                <li>Bridal Masterclass</li>
                <li>Editorial Techniques Intensive</li>
                <li>Business Foundations for Artists</li>
                <li>Professional Kit & Product Mastery</li>
              </ul>
              <Link to="/ekay/contact" className="ema-cta">Inquire</Link>
            </div>
            <div className="ema-tier-card ema-tier-2">
              <span className="ema-tier-badge">Tier 2</span>
              <h3 className="ema-tier-title">Skill Advancement</h3>
              <p className="ema-tier-desc">
                Deepen your expertise with focused workshops that refine specific techniques. Perfect for working artists ready to level up in bridal, editorial, or specialty niches.
              </p>
              <ul className="ema-tier-list">
                <li>Advanced Bridal Techniques</li>
                <li>Skincare & Prep Mastery</li>
                <li>Color Theory & Correction</li>
                <li>Industry Trends & Techniques</li>
              </ul>
              <Link to="/ekay/contact" className="ema-cta">Inquire</Link>
            </div>
            <div className="ema-tier-card ema-tier-3">
              <span className="ema-tier-badge">Tier 3</span>
              <h3 className="ema-tier-title">The Experience Program</h3>
              <p className="ema-tier-desc">
                Hands-on, immersive experiences that combine learning with real-world application. Shadow, assist, and participate in live sessions under Ekay&apos;s mentorship for a transformative learning journey.
              </p>
              <ul className="ema-tier-list">
                <li>Studio Assist & Shadow</li>
                <li>Live Bridal Experience</li>
                <li>Portfolio Building Sessions</li>
                <li>Mentorship & Feedback</li>
              </ul>
              <Link to="/ekay/contact" className="ema-cta">Inquire</Link>
            </div>
          </div>
        </section>

        <section className="ema-gallery" aria-label="Previous Programs Gallery">
          <h2 className="ema-gallery-title">Previous Programs</h2>
          <p className="ema-gallery-lead">Moments from EMA workshops and masterclasses</p>
          <div className="ema-gallery-grid">
            {galleryImages.map((img) => (
              <div key={img.id} className="ema-gallery-item">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ema-footer">
        <Link to="/sooziva" className="ema-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default EMA;

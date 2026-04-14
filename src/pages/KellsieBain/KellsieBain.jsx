import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
import "./KellsieBain.css";

const KellsieBain = () => {
  return (
    <div className="kellsie-bain">
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
          <Link to="/ekay" className="ekay-nav-link active">Home</Link>
          <Link to="/ekay/about" className="ekay-nav-link">About</Link>
          <Link to="/ekay/weddings" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <section className="ekay-hero">
        <p className="ekay-hero-text">
          Ekay is a sought after makeup artist and educator, offering refined makeup services for high end weddings and events across the globe.
        </p>
        <div className="ekay-hero-image">
          <img src="/ekay/sooziva.jpg" alt="Ekay Makeup" />
        </div>
        <p className="ekay-hero-quote">
          "Ekay has a true art for creating flawless and timeless beauty" — Sheri McMahon.
        </p>
      </section>

      <section className="kellsie-section kellsie-weddings">
        <div className="ekay-weddings-block">
          <div className="ekay-weddings-image">
            <img src="/ekay/IMG_9388.JPG" alt="Bridal makeup by Ekay" />
          </div>
          <div className="ekay-weddings-content">
            <h2 className="ekay-weddings-title">Weddings</h2>
            <p className="ekay-weddings-text">
              Ekay and her team have a global reach and are available to provide beauty services for a variety of events including engagements, elopements, weddings and other special occasions. With a presence across multiple regions, Ekay is recognized for her expertise in creating a natural, understated makeup look that highlights each individual's unique beauty. Her unwavering commitment to her clients and her calm demeanor make her an ideal choice for your wedding day.
            </p>
            <Link to="/ekay/weddings" className="ekay-weddings-btn">
              WEDDINGS
            </Link>
          </div>
        </div>
      </section>

      <p className="ekay-block-quote ekay-quote-bottom">
        As a devoted business mentor, Ekay is enthusiastic about sharing her knowledge with fellow makeup artists, offering both personalized and group training options, as well as various online resources.
      </p>

      <section className="kellsie-section kellsie-education">
        <div className="ekay-education-block">
          <div className="ekay-education-content">
            <h2 className="ekay-education-title">Education</h2>
            <p className="ekay-education-text">
              Ekay offers masterclasses, business coaching, and curated resources to help makeup artists grow their skills and build thriving practices. Whether you're looking for one-on-one mentorship or structured online courses, find the path that fits your goals.
            </p>
            <Link to="/education" className="ekay-weddings-btn">
              EDUCATION
            </Link>
          </div>
          <div className="ekay-education-image">
            <img src="/ekay/IMG_7714.JPG" alt="Ekay education and masterclass" />
          </div>
        </div>
      </section>

      <section className="kellsie-section kellsie-masterclass">
        <div className="ekay-masterclass-block">
          <div className="ekay-masterclass-image">
            <img src="/ekay/0T2A2099.JPEG" alt="Online Masterclass with Ekay" />
          </div>
          <div className="ekay-masterclass-content">
            <h2 className="ekay-masterclass-title">Online Masterclass</h2>
            <p className="ekay-masterclass-text">
              Join Ekay's online masterclass and learn the techniques and business skills that have made her a sought-after artist and educator. Access structured lessons, live Q&A, and resources you can revisit anytime—whether you're building your kit or leveling up your craft.
            </p>
            <Link to="/beauty-store" className="ekay-weddings-btn">
              JOIN MASTERCLASS
            </Link>
          </div>
        </div>
      </section>

      <footer className="kellsie-footer">
        <div className="kellsie-footer-inner">
        <div className="kellsie-footer-grid">
          <div className="kellsie-footer-col">
            <h4>Quick links</h4>
            <ul>
              <li><Link to="/ekay/weddings">Weddings</Link></li>
              <li><Link to="/education">Education</Link></li>
              <li><Link to="/ekay/ema">EMA</Link></li>
              <li><Link to="/sooziva">FAQs</Link></li>
            </ul>
          </div>
          <div className="kellsie-footer-col">
            <h4>Ekay</h4>
            <p>Over the course of her career, Ekay has established a worldwide presence as a bridal makeup artist, and she continues to pave her way in the beauty industry.</p>
          </div>
          <div className="kellsie-footer-col">
            <h4>Subscribe Now</h4>
            <p>Join our newsletter to stay updated on Ekay's news and events.</p>
            <Link to="/sooziva" className="kellsie-cta kellsie-cta-small">Subscribe now</Link>
          </div>
        </div>
        </div>
        <div className="kellsie-footer-social">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
        <div className="kellsie-footer-bottom">
          <Link to="/sooziva" className="kellsie-back-home">
            <IoIosArrowBack size={18} />
            Back to Ziva by Ekay
          </Link>
          <p className="kellsie-credit"> All rights reserved! 2026  <a href="https://sooziva.com/" target="_blank" rel="noopener noreferrer">Ziva by Ekay</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Transition(KellsieBain);

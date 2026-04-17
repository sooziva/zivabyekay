import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import "../KellsieBain/KellsieBain.css";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
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
          <Link to="/ekay/about" className="ekay-nav-link active">About</Link>
          <Link to="/wedding" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="about-main">
        <div className="about-content">
          <div className="about-image-wrap">
            <img src="/ekay/IMG_7871.JPG" alt="Ekay" />
          </div>
          <div className="about-text">
            <h1 className="about-title">About Ekay</h1>
            <p className="about-lead">
              Ekay is a sought-after makeup artist and educator, offering refined beauty services for high-end weddings and events across the globe.
            </p>
            <p className="about-body">
              Over the course of her career, Ekay has established a worldwide presence as a bridal makeup artist. She is recognized for her expertise in creating a natural, understated look that highlights each individual's unique beauty. Her unwavering commitment to her clients and her calm, professional demeanor make her an ideal choice for your wedding day—and her work has been celebrated by brides and industry peers alike.
            </p>
            <p className="about-body">
              As a devoted business mentor, Ekay is enthusiastic about sharing her knowledge with fellow makeup artists. She offers personalized and group training, masterclasses, and curated online resources to help artists grow their skills and build thriving practices. Whether you're a bride seeking timeless beauty or an artist looking to learn, Ekay brings the same dedication and artistry to every collaboration.
            </p>
          </div>
        </div>
      </main>

      <footer className="about-footer">
        <Link to="/sooziva" className="about-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default About;

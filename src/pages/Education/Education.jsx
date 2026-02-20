import { Link } from "react-router-dom";
import { IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
import "../KellsieBain/KellsieBain.css";
import "./Education.css";

const Education = () => {
  const cards = [
    {
      id: 1,
      label: "MASTERCLASSES",
      image: "/ekay/IMG_1442.PNG",
      cta: "MASTERCLASSES",
      link: "/education/masterclasses",
    },
    {
      id: 2,
      label: "BUSINESS COACHING",
      image: "/ekay/IMG_7663.JPG",
      cta: "COACHING CALLS",
      link: "/education/coaching-calls",
    },
    {
      id: 3,
      label: "RESOURCES + GUIDES",
      image: "/ekay/IMG_7841.JPG",
      cta: "RESOURCES & TEMPLATES",
      link: "/education/resources",
    },
  ];

  return (
    <div className="education-page">
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
          <Link to="/ekay/weddings" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link active">Education</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="education-main">
        <div className="education-cards">
          {cards.map((card) => (
            <Link to={card.link} key={card.id} className="education-card">
              <div className="education-card-image">
                <img src={card.image} alt={card.label} />
                <span className="education-card-label">{card.label}</span>
              </div>
              <div className="education-card-cta">
                {card.cta} →
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="education-footer">
        <Link to="/sooziva" className="education-back">← Back to Ziva by Ekay</Link>
      </footer>
    </div>
  );
};

export default Transition(Education);

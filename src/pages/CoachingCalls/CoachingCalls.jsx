import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
import "../KellsieBain/KellsieBain.css";
import "./CoachingCalls.css";

const CoachingCalls = () => {
  const options = [
    {
      id: 1,
      title: "Single session",
      description: "One focused call to tackle pricing, positioning, or a specific business challenge. Ideal for a targeted tune-up.",
      price: "£75",
      link: "/ekay/contact",
      image: "/ekay/IMG_7663.JPG",
      imageAlt: "Coaching call",
    },
    {
      id: 2,
      title: "3-session pack",
      description: "Three calls over a set period to build a clear plan—pricing, clients, and next steps. Best for artists ready to level up.",
      price: "£195",
      link: "/ekay/contact",
      featured: true,
      image: "/ekay/IMG_7871.JPG",
      imageAlt: "Business coaching",
    },
    {
      id: 3,
      title: "Ongoing support",
      description: "Regular check-ins and ongoing guidance as you grow. For those who want continued accountability and direction.",
      price: "From £150/mo",
      link: "/ekay/contact",
      image: "/ekay/IMG_7714.JPG",
      imageAlt: "Ongoing coaching",
    },
  ];

  return (
    <div className="coaching-page">
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

      <main className="coaching-main">
        <section className="coaching-hero">
          <div className="coaching-hero-content">
            <h1 className="coaching-title">Coaching calls</h1>
            <p className="coaching-lead">
              One-on-one business coaching with Ekay. Whether you're setting your rates, building your client base, or planning your next move, get tailored advice from someone who's built a global practice from the ground up.
            </p>
            <Link to="/ekay/contact" className="coaching-cta">
              Book a call
            </Link>
          </div>
          <div className="coaching-hero-image">
            <img src="/ekay/IMG_7663.JPG" alt="Ekay coaching" />
          </div>
        </section>

        <section className="coaching-options">
          <h2 className="coaching-options-title">How we can work together</h2>
          <div className="coaching-options-grid">
            {options.map((option) => (
              <div
                key={option.id}
                className={`coaching-option-card ${option.featured ? "coaching-option-card-featured" : ""}`}
              >
                <div className="coaching-option-image">
                  <img src={option.image} alt={option.imageAlt} />
                </div>
                <span className="coaching-option-label">{option.title}</span>
                <p className="coaching-option-desc">{option.description}</p>
                <div className="coaching-option-price">{option.price}</div>
                <Link to={option.link} className="coaching-option-cta">
                  Book a call
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="coaching-cta-block">
          <p className="coaching-cta-text">
            Not sure which option fits? Get in touch and we can find the right fit for where you are.
          </p>
          <Link to="/ekay/contact" className="coaching-cta coaching-cta-large">
            Get in touch
          </Link>
          <Link to="/education" className="coaching-back-link">← Back to Education</Link>
        </section>
      </main>

      <footer className="coaching-footer">
        <Link to="/sooziva" className="coaching-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Transition(CoachingCalls);

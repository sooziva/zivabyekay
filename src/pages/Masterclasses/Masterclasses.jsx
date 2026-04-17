import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import "../KellsieBain/KellsieBain.css";
import "./Masterclasses.css";

const Masterclasses = () => {
  const products = [
    {
      id: 1,
      theme: "Foundations",
      description: "Core technique, base & skin, and product essentials. Perfect for building a solid base.",
      price: "£49",
      link: "/beauty-store",
      image: "/ekay/IMG_1442.PNG",
      imageAlt: "Foundations masterclass",
    },
    {
      id: 2,
      theme: "Bridal intensive",
      description: "Full bridal workflow: trials, timing, looks, and day-of execution. Everything for wedding artists.",
      price: "£99",
      link: "/beauty-store",
      featured: true,
      image: "/ekay/IMG_9388.JPG",
      imageAlt: "Bridal intensive masterclass",
    },
    {
      id: 3,
      theme: "Complete bundle",
      description: "All modules plus business & kit building. Lifetime access and future updates included.",
      price: "£149",
      link: "/beauty-store",
      image: "/ekay/IMG_7841.JPG",
      imageAlt: "Complete bundle masterclass",
    },
  ];

  const modules = [
    {
      title: "Technique & application",
      description: "Step-by-step breakdown of Ekay's signature looks—base, eyes, lips, and finishing. Learn the products and methods she uses on brides and clients.",
    },
    {
      title: "Working with different skin tones",
      description: "How to assess skin, choose shades, and create a seamless finish for every client. Colour theory and product selection.",
    },
    {
      title: "Bridal & event timing",
      description: "Timelines, trial runs, and day-of logistics. Keep your client calm and your work flawless under real-world pressure.",
    },
    {
      title: "Building your kit & brand",
      description: "Curating a professional kit, pricing your services, and presenting yourself so clients trust you with their big day.",
    },
  ];

  return (
    <div className="masterclasses-page">
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
          <Link to="/wedding" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link active">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="masterclasses-main">
        <section className="masterclasses-hero">
          <div className="masterclasses-hero-content">
            <h1 className="masterclasses-title">Masterclasses</h1>
            <p className="masterclasses-lead">
              Learn from Ekay in structured, on-demand lessons you can watch anytime. From technique and product choice to bridal timing and building your business—everything she teaches in person, now available online.
            </p>
            <Link to="/beauty-store" className="masterclasses-cta">
              Get access
            </Link>
          </div>
          <div className="masterclasses-hero-image">
            <img src="/ekay/IMG_1442.PNG" alt="Ekay Masterclass" />
          </div>
        </section>

        <section className="masterclasses-modules">
          <h2 className="masterclasses-modules-title">What you'll learn</h2>
          <div className="masterclasses-modules-grid">
            {modules.map((mod, i) => (
              <div key={i} className="masterclasses-module">
                <span className="masterclasses-module-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="masterclasses-module-title">{mod.title}</h3>
                <p className="masterclasses-module-desc">{mod.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="masterclasses-products">
          <h2 className="masterclasses-products-title">Choose your masterclass</h2>
          <div className="masterclasses-products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className={`masterclasses-product-card ${product.featured ? "masterclasses-product-card-featured" : ""}`}
              >
                <div className="masterclasses-product-image">
                  <img src={product.image} alt={product.imageAlt} />
                </div>
                <span className="masterclasses-product-theme">{product.theme}</span>
                <p className="masterclasses-product-desc">{product.description}</p>
                <div className="masterclasses-product-price">{product.price}</div>
                <Link to={product.link} className="masterclasses-product-cta">
                  Get access
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="masterclasses-cta-block">
          <p className="masterclasses-cta-text">
            Join the masterclass and get lifetime access to all modules, plus updates as Ekay adds new content.
          </p>
          <Link to="/beauty-store" className="masterclasses-cta masterclasses-cta-large">
            Join the masterclass
          </Link>
          <Link to="/education" className="masterclasses-back-link">← Back to Education</Link>
        </section>
      </main>

      <footer className="masterclasses-footer">
        <Link to="/sooziva" className="masterclasses-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Masterclasses;

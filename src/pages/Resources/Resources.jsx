import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
import "../KellsieBain/KellsieBain.css";
import "./Resources.css";

const Resources = () => {
  const ebooks = [
    {
      id: "ebook-1",
      name: "Bridal makeup guide",
      category: "Ebook",
      price: null,
      originalPrice: null,
      image: "/ekay/brand1.PNG",
      link: "/education/resources/guide-text",
    },
    {
      id: "ebook-2",
      name: "Kit & product handbook",
      category: "Ebook",
      price: null,
      originalPrice: null,
      image: "/ekay/brand2.PNG",
      link: "/education/resources/checklist",
    },
    {
      id: "ebook-3",
      name: "Business foundations",
      category: "Ebook",
      price: null,
      originalPrice: null,
      image: "/ekay/brand3.PNG",
      link: "/education/resources/guide",
    },
  ];
  const storeItems = ebooks;

  const resources = [
    {
      id: 1,
      title: "Client intake & consultation",
      description: "Questionnaires and checklists to understand skin, preferences, and goals before the big day.",
      icon: "01",
    },
    {
      id: 2,
      title: "Bridal timeline templates",
      description: "Ready-to-use timelines for trials and wedding day so you and your client stay on track.",
      icon: "02",
    },
    {
      id: 3,
      title: "Pricing & packages guide",
      description: "A framework for structuring your services, packages, and add-ons with confidence.",
      icon: "03",
    },
    {
      id: 4,
      title: "Contract & booking terms",
      description: "Template terms for deposits, cancellations, and deliverables—adapt to your practice.",
      icon: "04",
    },
    {
      id: 5,
      title: "Social & portfolio prompts",
      description: "Ideas for what to capture and share so your work gets seen by the right clients.",
      icon: "05",
    },
    {
      id: 6,
      title: "Kit & product lists",
      description: "Curated lists and shopping guides to build or refine your professional kit.",
      icon: "06",
    },
  ];

  return (
    <div className="resources-page">
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

      <main className="resources-main">
        <section className="resources-hero">
          <div className="resources-hero-content">
            <h1 className="resources-title">Resources & templates</h1>
            <p className="resources-lead">
              Downloadable guides, checklists, and templates designed for makeup artists. From client intake to contracts and timelines—tools you can use straight away or adapt to your own brand.
            </p>
            <Link to="/beauty-store" className="resources-cta">
              Get access
            </Link>
          </div>
          <div className="resources-hero-image">
            <img src="/ekay/IMG_7841.JPG" alt="Resources and templates" />
          </div>
        </section>

        <section className="resources-store">
          <h2 className="resources-store-title">Shop</h2>
          <p className="resources-store-subtitle">Ebooks, guides & curated beauty picks</p>
          <div className="resources-store-grid">
            {storeItems.map((item) => (
              <Link to={item.link || "/beauty-store"} key={item.id} className="resources-store-card">
                <div className="resources-store-card-image resources-store-card-image--ebook">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="resources-store-card-body">
                  <span className="resources-store-card-category">{item.category}</span>
                  <h3 className="resources-store-card-name">{item.name}</h3>
                  <p className="resources-store-card-price">
                    {item.price != null ? (
                      <>
                        £{item.price.toFixed(2)}
                        {item.originalPrice && (
                          <span className="resources-store-card-original">£{item.originalPrice.toFixed(2)}</span>
                        )}
                      </>
                    ) : (
                      <span className="resources-store-card-ebook-label">Download</span>
                    )}
                  </p>
                  <span className="resources-store-card-cta">{item.category === "Ebook" ? "Get ebook" : "View product"}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="resources-store-footer">
            <Link to="/beauty-store" className="resources-cta">
              View all products
            </Link>
          </div>
        </section>

        <section className="resources-list">
          <h2 className="resources-list-title">What's included</h2>
          <div className="resources-grid">
            {resources.map((item) => (
              <div key={item.id} className="resources-item">
                <span className="resources-item-num">{item.icon}</span>
                <h3 className="resources-item-title">{item.title}</h3>
                <p className="resources-item-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resources-cta-block">
          <p className="resources-cta-text">
            All resources are available as part of the Complete bundle, or get in touch to ask about individual access.
          </p>
          <Link to="/beauty-store" className="resources-cta resources-cta-large">
            Get access
          </Link>
          <Link to="/education" className="resources-back-link">← Back to Education</Link>
        </section>
      </main>

      <footer className="resources-footer">
        <Link to="/sooziva" className="resources-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Transition(Resources);

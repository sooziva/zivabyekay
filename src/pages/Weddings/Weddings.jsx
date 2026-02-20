import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
import "../KellsieBain/KellsieBain.css";
import "./Weddings.css";

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

  return (
    <div className="weddings-page">
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
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="weddings-main">
        <section className="weddings-intro">
          <h1 className="weddings-title">Weddings</h1>
          <p className="weddings-lead">
            Ekay and her team have a global reach and are available to provide beauty services for engagements, elopements, weddings, and special occasions. A natural, understated look that highlights your unique beauty—with the calm and commitment you deserve on your day.
          </p>
          <div className="weddings-cta-group">
            <Link to="/ekay/weddings/inquiry" className="weddings-cta weddings-cta--primary">Bridal inquiry</Link>
            <Link to="/booking" className="weddings-cta">Book your date</Link>
          </div>
        </section>

        <section className="weddings-gallery">
          <div className="weddings-gallery-grid">
            {galleryImages.map((img) => (
              <div key={img.id} className="weddings-gallery-item">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
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

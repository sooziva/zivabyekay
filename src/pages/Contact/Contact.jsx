import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import "../KellsieBain/KellsieBain.css";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `From: ${formData.name} (${formData.email})\n\n${formData.message}`;
    window.location.href = `mailto:sooziva@gmail.com?subject=Enquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="contact-page">
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
          <Link to="/sooziva/wedding" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link active">Contact</Link>
        </nav>
      </header>

      <main className="contact-main">
        <div className="contact-layout">
          <div className="contact-visual">
            <div className="contact-image-wrap">
              <img src="/ekay/IMG_7871.JPG" alt="Ekay" />
            </div>
            <div className="contact-details">
              <h2 className="contact-heading">Get in touch</h2>
              <p className="contact-text">
                For wedding enquiries, education, or collaborations—reach out. We’d love to hear from you.
              </p>
              <a href="mailto:sooziva@gmail.com" className="contact-email">
                sooziva@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h2 className="contact-form-title">Send a message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="contact-label" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-input"
                placeholder="Your name"
                required
              />
              <label className="contact-label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-input"
                placeholder="your@email.com"
                required
              />
              <label className="contact-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-textarea"
                placeholder="Tell us about your event or enquiry..."
                rows={5}
                required
              />
              <button type="submit" className="contact-submit">
                Send message
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="contact-footer">
        <Link to="/sooziva" className="contact-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Contact;

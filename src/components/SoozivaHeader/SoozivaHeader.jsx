import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import "./SoozivaHeader.css";

const SoozivaHeader = () => {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const header = document.querySelector(".sooziva-header");
          const headerHeight = header?.offsetHeight || 0;
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }
    };

    const links = document.querySelectorAll(".sooziva-nav-link[href^='#']");
    links.forEach((link) => {
      link.addEventListener("click", handleAnchorClick);
    });
    return () => {
      links.forEach((link) => link.removeEventListener("click", handleAnchorClick));
    };
  }, []);

  return (
    <header className="sooziva-header">
      <div className="sooziva-header-inner">
        <button type="button" className="sooziva-header-icon" aria-label="Search">
          <IoIosSearch size={22} />
        </button>
        <Link to="/sooziva" className="sooziva-logo">
          <span className="sooziva-logo-name">Ziva</span>
          <span className="sooziva-logo-tagline">by Ekay</span>
        </Link>
        <div className="sooziva-header-icons">
          <Link to="/booking" className="sooziva-header-icon" aria-label="Book">
            <IoIosPerson size={22} />
          </Link>
          <Link to="/beauty-store" className="sooziva-header-icon" aria-label="Shop">
            <IoIosCart size={22} />
          </Link>
        </div>
      </div>
      <nav className="sooziva-nav">
        <a href="#work" className="sooziva-nav-link">Work</a>
        <a href="#about" className="sooziva-nav-link">About</a>
        <Link to="/booking" className="sooziva-nav-link">Book</Link>
        <a href="#contact" className="sooziva-nav-link">Contact</a>
      </nav>
    </header>
  );
};

export default SoozivaHeader;

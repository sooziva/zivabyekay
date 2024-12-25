import React, { useEffect } from "react";
import "./NavBar.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const NavBar = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".footer",
      start: "top 80%",
      onEnter: () => {
        document.querySelector(".navbar").classList.add("dark");
      },
      onLeaveBack: () => {
        document.querySelector(".navbar").classList.remove("dark");
      },
    });

    const handleClick = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    };

    const links = document.querySelectorAll(".nav-links a, .logo a");
    links.forEach((link) => {
      link.addEventListener("click", handleClick);
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      links.forEach((link) => {
        link.removeEventListener("click", handleClick);
      });
    };
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <a href="#hero">
            <h3>origin</h3>
          </a>
        </div>

        <div className="nav-items">
          <div className="langs">
            <p className="current-lang">EN</p>
            <p>VN</p>
            <p>ZH</p>
          </div>

          <div className="nav-links">
            <a href="#work">
              <p>Work</p>
            </a>
            <a href="#manifesto">
              <p>Manifesto</p>
            </a>
            <a href="#about">
              <p>Souls</p>
            </a>
            <a href="#team">
              <p>Team</p>
            </a>
            <a href="#contact">
              <p>Contact</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

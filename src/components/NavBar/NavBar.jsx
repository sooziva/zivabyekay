import React, { useEffect } from "react";
import "./NavBar.css";
import { Link } from "react-router";
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <h3>origin</h3>
          </Link>
        </div>

        <div className="nav-items">
          <div className="langs">
            <p className="current-lang">EN</p>
            <p>VN</p>
            <p>ZH</p>
          </div>

          <div className="nav-links">
            <Link to="/">
              <p>Work</p>
            </Link>
            <Link to="/">
              <p>Manifesto</p>
            </Link>
            <Link to="/">
              <p>Souls</p>
            </Link>
            <Link to="/">
              <p>Team</p>
            </Link>
            <Link to="/">
              <p>Contact</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

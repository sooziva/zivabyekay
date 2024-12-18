import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./App.css";
import HeroGradient from "./components/HeroGradient/HeroGradient";

const App = () => {
  const timelineRef = useRef(null);
  const headerRefs = useRef([]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    headerRefs.current = [];

    timelineRef.current = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
    });

    gsap.set(".header", {
      visibility: "hidden",
    });
    gsap.set(".header:first-child", {
      visibility: "visible",
    });
    gsap.set(".header h1", {
      opacity: 0,
      y: 40,
    });

    document.querySelectorAll(".header").forEach((header, index) => {
      const h1s = header.querySelectorAll("h1");
      const nextHeader =
        document.querySelectorAll(".header")[
          (index + 1) % document.querySelectorAll(".header").length
        ];

      const tl = gsap.timeline({
        paused: true,
      });

      tl.set(header, { visibility: "visible" })
        .to(h1s, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.inOut",
          force3D: true,
        })
        .to({}, { duration: 2 })
        .to(h1s, {
          opacity: 0,
          y: -40,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.inOut",
          force3D: true,
        })
        .set(header, { visibility: "hidden" })
        .set(nextHeader, { visibility: "visible" });

      timelineRef.current.add(tl.play(), index > 0 ? ">" : 0.5);
    });

    timelineRef.current.play();
  }, []);

  return (
    <div className="app">
      <section className="hero">
        <HeroGradient />
        <div className="header-container">
          <div
            className="header h-1"
            ref={(el) => (headerRefs.current[0] = el)}
          >
            <h1>United,</h1>
            <h1>Unbound</h1>
          </div>
          <div
            className="header h-2"
            ref={(el) => (headerRefs.current[1] = el)}
          >
            <h1>Tokyo-born,</h1>
            <h1>Creative studio</h1>
          </div>
          <div
            className="header h-3"
            ref={(el) => (headerRefs.current[2] = el)}
          >
            <h1>Hoi tu,</h1>
            <h1>Khong gioi han</h1>
          </div>
          <div
            className="header h-4"
            ref={(el) => (headerRefs.current[3] = el)}
          >
            <h1>Creative studio,</h1>
            <h1>Den tu Tokyo</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

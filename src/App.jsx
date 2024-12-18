import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./App.css";
import HeroGradient from "./components/HeroGradient/HeroGradient";

const App = () => {
  useEffect(() => {
    const headers = document.querySelectorAll(".header h1");
    const headerGroups = document.querySelectorAll(".header");

    gsap.set(headers, {
      opacity: 0,
      y: 40,
    });

    gsap.set(headerGroups, {
      visibility: "hidden",
    });
    gsap.set(headerGroups[0], {
      visibility: "visible",
    });

    const createHeaderAnimation = (headerIndex) => {
      const currentHeader = headerGroups[headerIndex];
      const nextHeader = headerGroups[(headerIndex + 1) % headerGroups.length];
      const h1s = currentHeader.querySelectorAll("h1");
      const nextH1s = nextHeader.querySelectorAll("h1");

      const tl = gsap.timeline({
        onComplete: () => {
          createHeaderAnimation((headerIndex + 1) % headerGroups.length);
        },
      });

      tl.set(nextH1s, {
        opacity: 0,
        y: 40,
      })
        .set(currentHeader, { visibility: "visible" })
        .to(h1s, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        .to({}, { duration: 2 })
        .to(h1s, {
          opacity: 0,
          y: -40,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        .set(currentHeader, { visibility: "hidden" })
        .set(nextHeader, { visibility: "visible" });
    };

    const initialDelay = setTimeout(() => {
      createHeaderAnimation(0);
    }, 500);

    return () => {
      clearTimeout(initialDelay);
      gsap.killTweensOf(headers);
    };
  }, []);

  return (
    <div className="app">
      <section className="hero">
        <HeroGradient />
        <div className="header-container">
          <div className="header h-1">
            <h1>United,</h1>
            <h1>Unbound</h1>
          </div>
          <div className="header h-2">
            <h1>Tokyo-born,</h1>
            <h1>Creative studio</h1>
          </div>
          <div className="header h-3">
            <h1>Hoi tu,</h1>
            <h1>Khong gioi han</h1>
          </div>
          <div className="header h-4">
            <h1>Creative studio,</h1>
            <h1>Den tu Tokyo</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

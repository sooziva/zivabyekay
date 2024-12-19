import { useEffect, useState, useRef } from "react";
import "./App.css";
import HeroGradient from "./components/HeroGradient/HeroGradient";
import ReactLenis from "@studio-freight/react-lenis";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

import { projects } from "./projects";

import { HiArrowRight } from "react-icons/hi";
import { RiArrowRightDownLine } from "react-icons/ri";

const App = () => {
  const manifestoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!isMobile) {
      gsap.set(".project", { opacity: 0.35 });
    }

    if (!isMobile) {
      const projects = document.querySelectorAll(".project");

      projects.forEach((project) => {
        project.addEventListener("mouseenter", () => {
          gsap.to(project, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        project.addEventListener("mouseleave", () => {
          gsap.to(project, {
            opacity: 0.35,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }

    const manifestoText = new SplitType(".manifesto-title h1", {
      types: ["words", "chars"],
      tagName: "span",
      wordClass: "word",
      charClass: "char",
    });

    const style = document.createElement("style");
    style.textContent = `
      .word {
        display: inline-block;
        margin-right: 0em;
      }
      .char {
        display: inline-block;
      }
    `;
    document.head.appendChild(style);

    gsap.set(manifestoText.chars, {
      opacity: 0.25,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top 35%",
        end: "bottom 75%",
        scrub: true,
        markers: false,
      },
    });

    manifestoText.chars.forEach((char, index) => {
      tl.to(
        char,
        {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        },
        index * 0.1
      );
    });

    gsap.to(".marquee-text", {
      scrollTrigger: {
        trigger: ".marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          const moveAmount = self.progress * -1000;
          gsap.set(".marquee-text", {
            x: moveAmount,
          });
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      manifestoText.revert();
      style.remove();
    };
  }, [isMobile]);

  return (
    <ReactLenis root>
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

        <section className="work">
          <div className="container">
            <div className="work-header">
              <HiArrowRight size={13} />
              <p>Selected project</p>
            </div>

            <div className="projects">
              <div className="project-col">
                {projects
                  .filter((project) => project.column === 1)
                  .map((project) => (
                    <div className="project" key={project.id}>
                      <div className="project-img">
                        <img src={project.image} alt="Project Thumbnail" />
                      </div>
                      <div className="project-name">
                        <h2>{project.title}</h2>
                      </div>
                      <div className="project-description">
                        <p>{project.description}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="project-col">
                {projects
                  .filter((project) => project.column === 2)
                  .map((project) => (
                    <div className="project" key={project.id}>
                      <div className="project-img">
                        <img src={project.image} alt="Project Thumbnail" />
                      </div>
                      <div className="project-name">
                        <h2>{project.title}</h2>
                      </div>
                      <div className="project-description">
                        <p>{project.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-bg-img">
            <img src="/cta/cta-bg.png" alt="" />
          </div>
          <div className="cta-title">
            <p>They trust us</p>
          </div>
          <div className="cta-header">
            <h2>
              Nike, Canada Goose, Mercari, Louis Vuitton, Shiseido, Amazon
              Fashion, Adidas, Hypebeast, Chupa Chups, JAL airlines, JETRO,
              Yonex, Toyota, Sony, Yamaha
            </h2>
          </div>
          <div className="cta-btn">
            <button>More details on origin.co</button>
          </div>
        </section>

        <section className="manifesto" ref={manifestoRef}>
          <div className="container">
            <div className="manifesto-header">
              <HiArrowRight size={13} />
              <p>Manifesto</p>
            </div>
            <div className="manifesto-title">
              <h1>
                We challenge norms, embrace change, pioneer progress. We are
                innovators merging art and technology to craft experiences that
                surprise, delight, and evolve.
              </h1>
            </div>
          </div>
        </section>

        <section className="processes">
          <div className="container">
            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Integrate</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-1.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    Born in Asia, raised by the world. Origin is the global
                    fulcrum between East and West. We blur boundaries of
                    difference, creating design that stands the test of time.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Collaborate</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-2.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    Collaboration over competition. Creativity, for origin
                    saigon, is like having a nabe with friends where we combine
                    the creativity that sets us apart.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Challenge</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-3.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    We create to evoke. We start where others stop, we question
                    the norms, we refuse to be redundant, Origin saigon seeks to
                    deliver original creative solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-text">
            <h1>Discover the origin of the origin studio</h1>
          </div>
        </div>

        <section className="showreel">
          <VideoPlayer />
        </section>

        <section className="about">
          <div className="container">
            <div className="about-col">
              <div className="about-header">
                <HiArrowRight size={13} />
                <p>Saigen Souls</p>
              </div>
              <div className="about-copy">
                <p>
                  Saigon Souls captures a state of mind. You are Saigonese if
                  you feel like you are, whether you just arrived, just returned
                  or have been living here your whole life. Most of all, just
                  being in Saigon makes you part of the Saigon Souls.
                </p>
              </div>
            </div>
            <div className="about-col">
              <div className="cta-btn">
                <button>More details on origin.co</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default App;

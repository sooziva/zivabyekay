import { useEffect, useState, useRef } from "react";
import "./App.css";
import HeroGradient from "./components/HeroGradient/HeroGradient";
import ReactLenis from "@studio-freight/react-lenis";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import NavBar from "./components/NavBar/NavBar";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

import { projects } from "./projects";

import { HiArrowRight } from "react-icons/hi";
import { RiArrowRightDownLine } from "react-icons/ri";
import { VscAdd } from "react-icons/vsc";

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

    ScrollTrigger.create({
      trigger: ".footer",
      start: "top 80%",
      onEnter: () => {
        document.querySelector(".team").classList.add("light");
        document.querySelector(".footer").classList.add("light");
      },
      onLeaveBack: () => {
        document.querySelector(".team").classList.remove("light");
        document.querySelector(".footer").classList.remove("light");
      },
    });

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const rows = document.querySelectorAll(".row");
    const isMobileView = window.innerWidth <= 900;

    const getStartX = (index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      return direction * (isMobileView ? 150 : 300);
    };

    if (rows.length > 0) {
      rows.forEach((row, index) => {
        const existingTrigger = ScrollTrigger.getAll().find(
          (st) => st.trigger === ".gallery" && st.vars?.targets === row
        );
        if (existingTrigger) {
          existingTrigger.kill();
        }

        const startX = getStartX(index);

        gsap.set(row, { x: startX });

        gsap.to(row, {
          scrollTrigger: {
            trigger: ".gallery",
            start: "top bottom",
            end: "bottom top",
            scrub: isMobileView ? 0.5 : 1,
            onUpdate: (self) => {
              const moveAmount = startX * (1 - self.progress);
              gsap.set(row, {
                x: moveAmount,
              });
            },
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);

  return (
    <ReactLenis root>
      <div className="app">
        <NavBar />
        <section className="hero" id="hero">
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

        <section className="work" id="work">
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

        <section className="manifesto" id="manifesto" ref={manifestoRef}>
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

        <section className="about" id="about">
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

        <section className="gallery">
          <div className="gallery-wrapper">
            <div className="row">
              <div className="img">
                <img src="/projects/project1.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project2.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project3.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project4.jpg" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/projects/project3.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project4.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project1.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project2.jpg" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/projects/project4.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project1.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project2.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project3.jpg" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/projects/project2.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project3.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project1.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/projects/project4.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="team" id="team">
          <div className="container">
            <div className="team-header">
              <HiArrowRight />
              <p>Team</p>
            </div>

            <div className="team-intro">
              <h1>
                From Tokyo to Saigon, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; we come
                from all &nbsp;&nbsp;&nbsp; over the world
              </h1>
            </div>

            <div className="team-member tm-1">
              <div className="team-member-position">
                <p>Lead Developer</p>
              </div>
              <div className="team-member-profile">
                <div className="team-member-img">
                  <img src="/team/team-1.jpg" alt="" />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Alex <br />
                      Johnson
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Alex is a skilled developer with expertise in modern web
                        technologies and a passion for creating seamless user
                        experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>(01)</p>
                <h1>Alex Johnson</h1>
              </div>
            </div>

            <div className="team-member tm-2">
              <div className="team-member-position">
                <p>UI/UX Designer</p>
              </div>
              <div className="team-member-profile">
                <div className="team-member-img">
                  <img src="/team/team-2.jpg" alt="" />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Sophia <br />
                      Martinez
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Sophia specializes in crafting intuitive and visually
                        appealing designs that bring digital products to life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>(02)</p>
                <h1>Sophia Martinez</h1>
              </div>
            </div>

            <div className="team-member tm-3">
              <div className="team-member-position">
                <p>Project Manager</p>
              </div>
              <div className="team-member-profile">
                <div className="team-member-img">
                  <img src="/team/team-3.jpg" alt="" />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Michael <br />
                      Brown
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Michael ensures projects are delivered on time and
                        within scope, maintaining excellent communication with
                        clients and the team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>(03)</p>
                <h1>Michael Brown</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="footer" id="contact">
          <div className="container">
            <div className="footer-header">
              <HiArrowRight />
              <p>Contact</p>
            </div>

            <div className="footer-title">
              <h1>Keep in touch</h1>
            </div>

            <div className="footer-email">
              <p>Start a conversation</p>
              <h2>contact@origin.co</h2>
            </div>

            <div className="footer-content">
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Our offices</p>
                </div>

                <div className="footer-col-content">
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>Saigon</h3>
                      <p>Vietnam Business Center,</p>
                      <p>Phong 802, lầu 8, 57-59 Hồ Tùng</p>
                      <p>Mậu, phường Bến Nghé,</p>
                      <p>quận 1, HCM</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>

                    <div className="location">
                      <h3>Tokyo HQ</h3>
                      <p>Vietnam Business Center,</p>
                      <p>Phong 802, lầu 8, 57-59 Hồ Tùng</p>
                      <p>Mậu, phường Bến Nghé,</p>
                      <p>quận 1, HCM</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>
                  </div>
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>Tokyo HQ</h3>
                      <p>Vietnam Business Center,</p>
                      <p>Phong 802, lầu 8, 57-59 Hồ Tùng</p>
                      <p>Mậu, phường Bến Nghé,</p>
                      <p>quận 1, HCM</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>

                    <div className="location">
                      <h3>Tokyo HQ</h3>
                      <p>Vietnam Business Center,</p>
                      <p>Phong 802, lầu 8, 57-59 Hồ Tùng</p>
                      <p>Mậu, phường Bến Nghé,</p>
                      <p>quận 1, HCM</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Follow us</p>
                </div>
                <div className="footer-sub-col">
                  <p>Facebook</p>
                  <p>Instagram</p>
                  <p>Twitter</p>
                  <p>LinkedIn</p>
                  <p>Vimeo</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default App;

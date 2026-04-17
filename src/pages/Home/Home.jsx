import { useEffect, useState, useRef } from "react";
import "./Home.css";
import "./Vouchers.css";
import { Link } from "react-router";

import HeroGradient from "../../components/HeroGradient/HeroGradient";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import SoozivaHeader from "../../components/SoozivaHeader/SoozivaHeader";
import Cursor from "../../components/Cursor/Cursor";

import { projects } from "./projects";
import { beautyProducts } from "../BeautyStore/products";
import { vouchers } from "./vouchers";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ReactLenis from "@studio-freight/react-lenis";

import { HiArrowRight, HiStar, HiClipboardCopy } from "react-icons/hi";
import { RiArrowRightDownLine } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Home = () => {
  const manifestoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [beautySlide, setBeautySlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const projectsCarouselRef = useRef(null);
  const beautyCarouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const beautyTouchStartX = useRef(0);
  const beautyTouchEndX = useRef(0);
  
  // Calculate how many projects to show based on screen size
  const getProjectsPerView = () => {
    if (isMobile) return 1;
    return 3;
  };
  
  const projectsPerView = getProjectsPerView();
  const maxSlide = Math.max(0, Math.ceil(projects.length / projectsPerView) - 1);
  
  // Get featured beauty products
  const featuredBeautyProducts = beautyProducts.filter(product => product.featured);
  const beautyPerView = isMobile ? 1 : 3;
  const maxBeautySlide = Math.max(0, Math.ceil(featuredBeautyProducts.length / beautyPerView) - 1);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 0);

    return () => clearTimeout(scrollTimeout);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    
    const handleKeyDown = (e) => {
      const maxSlide = Math.max(0, Math.ceil(projects.length / getProjectsPerView()) - 1);
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projects.length, isMobile]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || projects.length === 0) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    const maxSlide = Math.max(0, Math.ceil(projects.length / getProjectsPerView()) - 1);

    if (distance > minSwipeDistance) {
      // Swipe left - next slide
      setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleBeautyTouchStart = (e) => {
    beautyTouchStartX.current = e.touches[0].clientX;
  };

  const handleBeautyTouchMove = (e) => {
    beautyTouchEndX.current = e.touches[0].clientX;
  };

  const handleBeautyTouchEnd = () => {
    if (!beautyTouchStartX.current || !beautyTouchEndX.current || featuredBeautyProducts.length === 0) return;
    
    const distance = beautyTouchStartX.current - beautyTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next slide
      setBeautySlide((prev) => (prev === maxBeautySlide ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      setBeautySlide((prev) => (prev === 0 ? maxBeautySlide : prev - 1));
    }

    beautyTouchStartX.current = 0;
    beautyTouchEndX.current = 0;
  };

  useEffect(() => {
    // Reset to first slide if current slide is out of bounds
    const maxSlide = Math.max(0, Math.ceil(projects.length / getProjectsPerView()) - 1);
    if (currentSlide > maxSlide && projects.length > 0) {
      setCurrentSlide(0);
    }
  }, [projects.length, currentSlide, isMobile]);

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
      const projects = document.querySelectorAll(".project");

      projects.forEach((project) => {
        const projectImg = project.querySelector(".project-img img");

        project.addEventListener("mouseenter", () => {
          gsap.to(projectImg, {
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        project.addEventListener("mouseleave", () => {
          gsap.to(projectImg, {
            scale: 1,
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
      <div className="home">
        <Cursor />
        <SoozivaHeader />
        <section className="hero" id="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-left">
                {/* <div className="hero-header">
                  <HiArrowRight />
                  <p>About Founder</p>
                </div> */}

                <div className="hero-intro">
                  <h1>
                    The vision behind &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ziva by Ekay
                  </h1>
                </div>

                <div className="hero-founder-info">
                  <div className="hero-founder-name">
                    <p>
                      Ekay <br />
                      Gabriel
                    </p>
                  </div>
                  <div className="hero-founder-position">
                    <p>Founder & Lead Makeup Artist</p>
                  </div>
                  <div className="hero-founder-description">
                    <p>
                      Ekay is the creative force and founder behind Ziva by Ekay, with
                      over a decade of experience in professional makeup artistry.
                      Specializing in bridal, editorial, and special event makeup,
                      she brings passion and precision to every look. Her vision is to
                      create a space where beauty meets artistry, helping each client
                      discover their unique style and confidence.
                    </p>
                  </div>
                </div>

                <div className="hero-cta-buttons">
                  <div className="cta-btn">
                    <Link to="/booking">
                      <button>Book Appointment</button>
                    </Link>
                  </div>
                  <div className="cta-btn">
                    <Link to="/beauty-store">
                      <button>Shop products</button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="hero-right hero-video-block">
                <div className="hero-video-container">
                  <video
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/video/ekay.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="work" id="work">
          <div className="container">
            <div className="work-header">
              <HiArrowRight size={13} />
              <p>Beauty Services</p>
            </div>

            <div className="projects-carousel-wrapper">
              <div 
                className="projects-carousel" 
                ref={projectsCarouselRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="projects-carousel-track"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / projectsPerView)}%)`
                  }}
                >
                  {projects.map((project) => (
                    <div className="project-slide" key={project.id}>
                      <Link to="/booking">
                        <div className="project">
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
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {projects.length > projectsPerView && (
                <div className="carousel-controls">
                  <button 
                    className="carousel-btn carousel-btn-prev"
                    onClick={() => {
                      const maxSlide = Math.max(0, Math.ceil(projects.length / projectsPerView) - 1);
                      setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));
                    }}
                    aria-label="Previous projects"
                  >
                    <IoIosArrowBack size={24} />
                  </button>
                  <div className="carousel-dots">
                    {Array.from({ length: Math.ceil(projects.length / projectsPerView) }).map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="carousel-btn carousel-btn-next"
                    onClick={() => {
                      const maxSlide = Math.max(0, Math.ceil(projects.length / projectsPerView) - 1);
                      setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
                    }}
                    aria-label="Next projects"
                  >
                    <IoIosArrowForward size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-bg-img">
            <img src="/cta/cta-bg.png" alt="" />
          </div>
          <div className="cta-title">
            <p>Trusted by beauty enthusiasts</p>
          </div>
          <div className="cta-header">
            <h2>Discover luxury beauty services</h2>
          </div>
          <div className="cta-buttons">
            <div className="cta-btn">
              <Link to="/beauty-store">
                <button>Shop now</button>
              </Link>
            </div>
            <div className="cta-btn">
              <Link to="/booking">
                <button>Book Appointment</button>
              </Link>
            </div>
          </div>
        </section>

        <section className="featured-beauty">
          <div className="container">
            <div className="featured-beauty-header">
              <h1 className="featured-beauty-title">Shop All</h1>
              <p className="featured-beauty-count">{featuredBeautyProducts.length} products</p>
            </div>

            <div className="beauty-carousel-wrapper">
              <div 
                className="beauty-carousel" 
                ref={beautyCarouselRef}
                onTouchStart={handleBeautyTouchStart}
                onTouchMove={handleBeautyTouchMove}
                onTouchEnd={handleBeautyTouchEnd}
              >
                <div 
                  className="beauty-carousel-track"
                  style={{
                    transform: `translateX(-${beautySlide * (100 / beautyPerView)}%)`
                  }}
                >
                  {featuredBeautyProducts.map((product) => (
                    <div className="beauty-product-slide" key={product.id}>
                      <Link to="/beauty-store" className="beauty-product-link">
                        <div className="beauty-product-card">
                          <div className="beauty-product-image-wrapper">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="beauty-product-image"
                            />
                          </div>
                          <div className="beauty-product-info">
                            <h3 className="beauty-product-name">{product.name}</h3>
                            <p className="beauty-product-description">
                              {product.description.split('.')[0]}.
                            </p>
                            <div className="beauty-product-price-rating">
                              <div className="beauty-product-price">
                                <span className="beauty-current-price">${product.price}</span>
                              </div>
                              <div className="beauty-product-rating">
                                {[...Array(5)].map((_, i) => (
                                  <HiStar
                                    key={i}
                                    size={16}
                                    className={i < Math.floor(product.rating) ? "filled" : ""}
                                  />
                                ))}
                                <span className="rating-count">({product.reviews || 0})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {featuredBeautyProducts.length > beautyPerView && (
                <div className="beauty-carousel-controls">
                  <button 
                    className="beauty-carousel-btn beauty-carousel-btn-prev"
                    onClick={() => {
                      setBeautySlide((prev) => (prev === 0 ? maxBeautySlide : prev - 1));
                    }}
                    aria-label="Previous products"
                  >
                    <IoIosArrowBack size={24} />
                  </button>
                  <div className="beauty-carousel-dots">
                    {Array.from({ length: Math.ceil(featuredBeautyProducts.length / beautyPerView) }).map((_, index) => (
                      <button
                        key={index}
                        className={`beauty-carousel-dot ${index === beautySlide ? 'active' : ''}`}
                        onClick={() => setBeautySlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="beauty-carousel-btn beauty-carousel-btn-next"
                    onClick={() => {
                      setBeautySlide((prev) => (prev === maxBeautySlide ? 0 : prev + 1));
                    }}
                    aria-label="Next products"
                  >
                    <IoIosArrowForward size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Special Offers - commented out
        <section className="vouchers" id="vouchers">
          <div className="container">
            <div className="vouchers-header">
              <HiArrowRight size={13} />
              <p>Special Offers</p>
            </div>
            <div className="vouchers-grid">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="voucher-card">
                  <div className="voucher-content">
                    <h3 className="voucher-title">{voucher.title}</h3>
                    <div className="voucher-discount">{voucher.discount}</div>
                    <div className="voucher-code-wrapper">
                      <span className="voucher-code">{voucher.code}</span>
                      <button
                        className={`voucher-copy-btn ${copiedCode === voucher.id ? 'copied' : ''}`}
                        onClick={() => {
                          navigator.clipboard.writeText(voucher.code);
                          setCopiedCode(voucher.id);
                          setTimeout(() => setCopiedCode(null), 2000);
                        }}
                        aria-label="Copy code"
                      >
                        <HiClipboardCopy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        <section className="manifesto" id="manifesto" ref={manifestoRef}>
          <div className="container">
            <div className="manifesto-header">
              <HiArrowRight size={13} />
              <p>Manifesto</p>
            </div>
            <div className="manifesto-title">
              <h1>
                We believe beauty is an art form, a celebration of individuality.
                At Ziva by Ekay, we merge professional artistry with personalized
                care to enhance your natural beauty and boost your confidence.
              </h1>
            </div>
          </div>
        </section>

        <section className="processes">
          <div className="container">
            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Consultation</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-1.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    Every beauty journey begins with understanding your unique
                    features, skin tone, and personal style. We take time to
                    listen and create a customized look that enhances your
                    natural beauty and reflects your personality.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Artistry</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-2.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    With years of experience and a passion for perfection, our
                    makeup artists use premium products and professional techniques
                    to create flawless looks for any occasion—from natural everyday
                    glam to stunning bridal transformations.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Excellence</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-3.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    We are committed to excellence in every detail. From the
                    quality of products we use to the precision of our application,
                    we ensure every client leaves feeling beautiful, confident,
                    and ready to shine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-text">
            <h1>Experience the artistry of Ziva by Ekay Beauty Studio</h1>
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
                <p>Our Philosophy</p>
              </div>
              <div className="about-copy">
                <p>
                  At Ziva by Ekay, we believe beauty is about enhancing your
                  natural features and celebrating your unique style. Whether
                  you're preparing for a special occasion, seeking everyday glamour,
                  or learning new techniques, we're here to help you look and feel
                  your absolute best. Every face tells a story, and we're honored
                  to be part of yours.
                </p>
              </div>
            </div>
            <div className="about-col">
              <div className="cta-btn">
                <Link to="/booking">
                  <button>Book Your Appointment</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="gallery">
          <div className="gallery-wrapper">
            <div className="row">
              <div className="img">
                <img src="/models/model1.JPEG" alt="" />
              </div>
              <div className="img">
                <img src="/models/model1.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model8.JPEG" alt="" />
              </div>
              <div className="img">
                <img src="/models/model12.JPEG" alt="Model Portfolio" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/models/model3.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model12.JPEG" alt="" />
              </div>
              <div className="img">
                <img src="/models/model4.JPG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model4.JPG" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/models/model9.JPEG" alt="" />
              </div>
              <div className="img">
                <img src="/models/model5.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model6.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model12.JPEG" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/models/model7.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model3.JPEG" alt="" />
              </div>
              <div className="img">
                <img src="/models/model9.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model10.JPEG" alt="Model Portfolio" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/models/model11.JPEG" alt="" />
              </div>
              <div className="img">
                <img src="/models/model11.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model12.JPEG" alt="Model Portfolio" />
              </div>
              <div className="img">
                <img src="/models/model13.JPEG" alt="Model Portfolio" />
              </div>
            </div>
          </div>
        </section>

        <section className="team" id="team">
          <div className="container">
            <div className="team-header">
              <HiArrowRight />
              <p>About Founder</p>
            </div>

            <div className="team-intro">
              <h1>
                The vision behind &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ziva by Ekay
              </h1>
            </div>

            <div className="team-member tm-1">
              <div className="team-member-position">
                <p>Founder & Lead Makeup Artist</p>
              </div>
              <div className="team-member-profile">
                <div className="founder-video-container">
                  <video
                    className="founder-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/video/ekay.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Ekay <br />
                      Gabriel
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Ekay is the creative force and founder behind Ziva by Ekay, with
                        over a decade of experience in professional makeup artistry.
                        Specializing in bridal, editorial, and special event makeup,
                        she brings passion and precision to every look. Her vision is to
                        create a space where beauty meets artistry, helping each client
                        discover their unique style and confidence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>Founder</p>
                <h1>Ekay Gabriel</h1>
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
              <p>We'd love to hear from you</p>
              <h2>sooziva@gmail.com</h2>
            </div>

            <div className="footer-content">
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Visit Us</p>
                </div>

                <div className="footer-col-content">
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>Studio Location</h3>
                      <p>Ziva by Ekay Beauty Studio</p>
                      <p>By Appointment Only</p>
                      <p>Private Studio Sessions</p>
                      <p>Available</p>

                      <p>
                        <HiArrowRight /> Book Appointment
                      </p>
                    </div>

                    <div className="location">
                      <h3>Mobile Services</h3>
                      <p>We come to you</p>
                      <p>Bridal & Special Events</p>
                      <p>Available upon request</p>
                      <p>Contact for details</p>

                      <p>
                        <HiArrowRight /> Inquire Now
                      </p>
                    </div>
                  </div>
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>Hours</h3>
                      <p>Monday - Friday: 9AM - 7PM</p>
                      <p>Saturday: 10AM - 6PM</p>
                      <p>Sunday: By Appointment</p>
                      <p>Emergency bookings available</p>

                      <p>
                        <HiArrowRight /> View Availability
                      </p>
                    </div>

                    <div className="location">
                      <h3>Services</h3>
                      <p>Bridal Makeup</p>
                      <p>Editorial & Photoshoots</p>
                      <p>Special Events</p>
                      <p>Makeup Lessons</p>

                      <p>
                        <HiArrowRight /> View Services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Follow Us</p>
                </div>
                <div className="footer-sub-col">
                  <p>Instagram</p>
                  <p>Facebook</p>
                  <p>TikTok</p>
                  <p>Pinterest</p>
                  <p>YouTube</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Home;

import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import Transition from "../../components/Transition/Transition";
import "../KellsieBain/KellsieBain.css";
import "./Guide.css";

export const GuideContent = ({ withImages = true, withCoverImage = true }) => {
  const sections = [
    {
      id: 1,
      title: "Connect with other artists — assist other artists",
      image: "/ekay/0T2A2099.JPEG",
      body: "This is the spot a lot of you miss. Trying to figure it out all by yourself but listen: A great way to build your reputation as a professional makeup artist is by offering to assist other artists. Not only will you gain valuable hands-on experience, you'll also get the opportunity to network with other professionals in your industry and meet potential clients. While you might not make tons of money as an assistant, think of it as free education given the skills you'll learn on the job. Over time, your reputation will slowly build and the artists who once hired you will start recommending you for jobs when they're unavailable.",
    },
    {
      id: 2,
      title: "Position yourself as an expert by Showing Your Face",
      image: "/ekay/IMG_7714.JPG",
      body: "Showing your face will create the brand recognition you need to build a successful makeup business. It is so important to offer your followers and potential clients the opportunity to know who you are and what makes you more than \"just another makeup artist.\" Cultivating a personal brand differentiates you in the industry and your authenticity will set you apart. People want to know the face behind the brand, they want to know who they're dealing with! Show your face on Instagram and TikTok and watch your audience grow!",
    },
    {
      id: 3,
      title: "Offer Competitive Pricing",
      image: "/ekay/IMG_7874.PNG",
      body: "While the end goal might be to charge $200 per face, the reality is you just can't charge high-end prices when you're starting out as a MUA. A good tip is to research what other makeup artists in your area are charging and offer a rate that is 30% lower. While it might not be a lot of money, think about the people you'll meet and the future job opportunities that will arise. It might suck charging a low rate at first, but it's a temporary sacrifice until you gain a reputation in the industry. Charging a low rate also gives you time to gain valuable on-the-job experience as an artist, so that when you finally decide to increase your prices, your rates will be in line with your skill level. Each client you meet will link you to another potential client, and each time you can charge a little more, until finally you're able to charge your desired rate.",
    },
    {
      id: 4,
      title: "Build your portfolio — Collaborate with anyone and everyone",
      image: "/ekay/IMG_7663.JPG",
      body: "Having a successful makeup business sometimes comes down to not what you know, but whom you know. Find a hairstylist (or one you already have a relationship with) and see if they'd be keen to create some looks with you. Think about your circle of friends — who do you know that's a photographer, a fashion designer, a jewelry designer, an influencer, even an event planner? The more people who share your photos, speak your name and recommend you to their circle, the better.",
    },
    {
      id: 5,
      title: "Be Active Across All Online Platforms",
      image: "/ekay/IMG_9388.JPG",
      body: "Our makeup business doesn't rely on our makeup skills alone. Our business demands us to understand social media and have an online presence as well. When your makeup business has a digital presence, it makes it much easier for customers and brands to find you and to get to know you. Ensure you're active across TikTok, Instagram, Facebook and YouTube — the more platforms, the better.",
    },
    {
      id: 6,
      title: "Focus on delivering quality work and excellent customer service",
      image: "/ekay/IMG_7871.JPG",
      body: "Something I always tell my students is: your current client who's sitting on your chair right now is your billboard. Do the best job you can do cause she's going into rooms filled with other ladies who are gonna ask questions like who did your makeup — and you want to do a good enough job for her to call your name and speak highly of it. Deliver the best customer service that they can't stop speaking about it.",
    },
    {
      id: 7,
      title: "Educate Your Audience",
      image: "/ekay/IMG_0458.JPG",
      body: "The best way to build your reputation as a professional makeup artist is by proving to your audience that you are skilled and worthy of their time and money. Put in the time and effort to educate your online audience about makeup, skincare, products, business — anything! People love to be taught a new skill, no matter how simple we might think it is. Share your favourite foundation or post a tutorial on how to apply eyeliner — whatever it is, people love to learn and this kind of education will help you establish yourself as a professional! Watch these viewers turn into clients!",
    },
  ];

  return (
    <div className="guide-page">
      <Link to="/education/resources" className="kellsie-top-banner">
        ← Back to Resources & Templates
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
          <Link to="/ekay/weddings" className="ekay-nav-link">Weddings</Link>
          <Link to="/education" className="ekay-nav-link active">Education</Link>
          <Link to="/ekay/ema" className="ekay-nav-link">EMA</Link>
          <Link to="/ekay/contact" className="ekay-nav-link">Contact</Link>
        </nav>
      </header>

      <main className="guide-main">
        <article className="guide-article">
          {withCoverImage && (
            <div className="guide-hero-image">
              <img src="/ekay/IMG_7841.JPG" alt="Makeup artist at work" />
            </div>
          )}
          <header className={`guide-header ${!withCoverImage ? "guide-header--no-hero" : ""}`}>
            <span className="guide-badge">Free guide</span>
            <h1 className="guide-title">
              The Ultimate Insiders Guide for Makeup Artists Truly Ready to Grow in 2026
            </h1>
            <p className="guide-intro">
              Before I became a sought-after celebrity MUA and a makeup business coach, I was exactly where you might be right now: Talented, hardworking af, and trying different things to grow my business… Yet still not fully booked, still comparing myself to other artists, and still giving out discounts just to earn some income. (A sad spot!)
            </p>
            <p className="guide-intro">
              That's why I created this guide to help you stop overthinking what to do and start doing what's possible with the skill you already have. Inside this guide you'll find 7 beginner-friendly ideas made specifically for you. A clear starting point so you can move forward instead of staying stuck. You just need 1 point that clicks — and this guide is meant to help you find it. Take your time going through it and highlight what resonates with you.
            </p>
          </header>

          <div className="guide-sections">
            {sections.map((section, index) => (
              <section key={section.id} className={`guide-section ${withImages && section.image ? "guide-section--with-image" : ""}`}>
                {withImages && section.image && (
                  <div className={`guide-section-image guide-section-image--${index % 2 === 0 ? "left" : "right"}`}>
                    <img src={section.image} alt="" loading="lazy" />
                  </div>
                )}
                <div className="guide-section-content">
                  <span className="guide-section-num">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="guide-section-title">{section.title}</h2>
                  <p className="guide-section-body">{section.body}</p>
                </div>
              </section>
            ))}
          </div>
        </article>

        <div className="guide-actions">
          <Link to="/education/resources" className="guide-cta">← Back to Resources</Link>
          <Link to="/ekay/contact" className="guide-cta guide-cta-primary">Get in touch</Link>
        </div>
      </main>

      <footer className="guide-footer">
        <Link to="/sooziva" className="guide-back">
          <IoIosArrowBack size={18} />
          Back to Ziva by Ekay
        </Link>
      </footer>
    </div>
  );
};

export default Transition(GuideContent);

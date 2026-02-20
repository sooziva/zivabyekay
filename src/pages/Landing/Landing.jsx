import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-inner">
        <h1 className="landing-title">Welcome</h1>
        <p className="landing-subtitle">Choose where you’d like to go</p>
        <div className="landing-cards">
          <Link to="/sooziva" className="landing-card landing-card--sooziva">
            <div className="landing-card-image">
              <img src="/ekay/0T2A2099.JPEG" alt="Sooziva" />
            </div>
            <div className="landing-card-content">
              <span className="landing-card-label">Business</span>
              <h2 className="landing-card-title">Sooziva</h2>
              <p className="landing-card-desc">Ziva by Ekay — makeup, weddings, booking & inspiration</p>
              <span className="landing-card-cta">Enter →</span>
            </div>
          </Link>
          <Link to="/ekay" className="landing-card landing-card--ekay">
            <div className="landing-card-image">
              <img src="/ekay/0T2A2123.JPEG" alt="Ekay" />
            </div>
            <div className="landing-card-content">
              <span className="landing-card-label">TheBrand</span>
              <h2 className="landing-card-title">Ekay</h2>
              <p className="landing-card-desc">Work, Education, masterclasses & resources</p>
              <span className="landing-card-cta">Enter →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;

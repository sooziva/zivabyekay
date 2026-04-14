import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HiStar } from "react-icons/hi";
import Transition from "../../components/Transition/Transition";
import "./BridalInquiry.css";

const STEPS = [
  { id: 1, label: "ABOUT YOU" },
  { id: 2, label: "YOUR WEDDING" },
  { id: 3, label: "BRIDAL PARTY" },
  { id: 4, label: "YOUR VISION" },
  { id: 5, label: "FINALISE" },
];

const REFERRAL_OPTIONS = [
  "Referred by a friend",
  "Instagram",
  "Facebook",
  "Wedding vendor",
  "Google search",
  "Other",
];

const BridalInquiry = () => {
  const [searchParams] = useSearchParams();
  const selectedTier = (searchParams.get("tier") || "").trim();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tier: "",
    firstName: "",
    whatsapp: "",
    email: "",
    cityCountry: "",
    referral: "",
    weddingDate: "",
    venue: "",
    weddingTime: "",
    bridalPartySize: "",
    bridesmaidsMakeup: "",
    stylePreference: "",
    skinType: "",
    notes: "",
  });

  useEffect(() => {
    if (!selectedTier) return;
    setFormData((prev) => (prev.tier ? prev : { ...prev, tier: selectedTier }));
  }, [selectedTier]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (nextStep) => {
    if (nextStep >= 1 && nextStep <= 5) setStep(nextStep);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
    } else {
      // TODO: Submit form to backend
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="bridal-inquiry-page">
      <header className="bridal-inquiry-header">
        <p className="bridal-inquiry-header-badge">BRIDAL INQUIRY 2026</p>
        <h1 className="bridal-inquiry-brand">
          <span className="bridal-inquiry-brand-ziva">Ziva</span>
          <span className="bridal-inquiry-brand-ekay"> by Ekay</span>
        </h1>
        <p className="bridal-inquiry-header-location">GLOBAL MAKEUP ARTIST ACCRA, GHANA</p>
        <p className="bridal-inquiry-tagline">
          Tell us about your special day — every detail helps us craft a truly bespoke experience for you.
        </p>
        {formData.tier ? (
          <p className="bridal-inquiry-tier-chip" aria-label={`Selected tier: ${formData.tier}`}>
            Selected tier: {formData.tier}
          </p>
        ) : null}

        <nav className="bridal-inquiry-progress" aria-label="Form steps">
          {STEPS.map((s) => {
            const isActive = step === s.id;
            const isComplete = step > s.id;
            return (
              <button
                key={s.id}
                type="button"
                className={`bridal-inquiry-progress-step${isActive ? " bridal-inquiry-progress-step--active" : ""}${isComplete ? " bridal-inquiry-progress-step--complete" : ""}`}
                onClick={() => goToStep(s.id)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${s.label}, step ${s.id} of 5`}
              >
                <span className="bridal-inquiry-progress-num" aria-hidden>
                  {s.id}
                </span>
                <span className="bridal-inquiry-progress-label">{s.label}</span>
              </button>
            );
          })}
        </nav>
        <p className="bridal-inquiry-progress-hint">Tap any step to jump back and edit.</p>
      </header>

      <main className="bridal-inquiry-main">
        <form onSubmit={handleSubmit} className="bridal-inquiry-form">
          <div className="bridal-inquiry-form-card">
            <input type="hidden" name="tier" value={formData.tier} />
            <p className="bridal-inquiry-step-label">STEP {String(step).padStart(2, "0")} OF 05</p>

            {step === 1 && (
              <>
                <h2 className="bridal-inquiry-form-title">Tell us about yourself</h2>
                <p className="bridal-inquiry-form-subtitle">
                  Let's start with the basics — we'd love to know who we're working with.
                </p>
                <div className="bridal-inquiry-fields">
                  <div className="bridal-inquiry-field">
                    <label htmlFor="firstName">FIRST NAME *</label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder=""
                      required
                    />
                  </div>
                  <div className="bridal-inquiry-field">
                    <label htmlFor="whatsapp">WHATSAPP NUMBER *</label>
                    <input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => updateField("whatsapp", e.target.value)}
                      placeholder="e.g. 0532818725"
                      required
                    />
                  </div>
                  <div className="bridal-inquiry-field">
                    <label htmlFor="email">EMAIL ADDRESS *</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="bridal-inquiry-field">
                    <label htmlFor="cityCountry">CITY / COUNTRY *</label>
                    <input
                      id="cityCountry"
                      type="text"
                      value={formData.cityCountry}
                      onChange={(e) => updateField("cityCountry", e.target.value)}
                      placeholder="e.g. Accra, Ghana"
                      required
                    />
                  </div>
                  <div className="bridal-inquiry-field bridal-inquiry-field--full">
                    <label htmlFor="referral">HOW DID YOU FIND ZIVA BY EKAY? *</label>
                    <select
                      id="referral"
                      value={formData.referral}
                      onChange={(e) => updateField("referral", e.target.value)}
                      required
                    >
                      <option value="">Select an option</option>
                      {REFERRAL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="bridal-inquiry-form-title">Your wedding</h2>
                <p className="bridal-inquiry-form-subtitle">
                  Share the details of your special day.
                </p>
                <div className="bridal-inquiry-fields">
                  <div className="bridal-inquiry-field">
                    <label htmlFor="weddingDate">WEDDING DATE *</label>
                    <input
                      id="weddingDate"
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => updateField("weddingDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="bridal-inquiry-field">
                    <label htmlFor="venue">VENUE / LOCATION *</label>
                    <input
                      id="venue"
                      type="text"
                      value={formData.venue}
                      onChange={(e) => updateField("venue", e.target.value)}
                      placeholder="Where is your wedding?"
                      required
                    />
                  </div>
                  <div className="bridal-inquiry-field">
                    <label htmlFor="weddingTime">CEREMONY OR GET-READY TIME</label>
                    <input
                      id="weddingTime"
                      type="time"
                      value={formData.weddingTime}
                      onChange={(e) => updateField("weddingTime", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="bridal-inquiry-form-title">Bridal party</h2>
                <p className="bridal-inquiry-form-subtitle">
                  Let us know about your bridal party makeup needs.
                </p>
                <div className="bridal-inquiry-fields">
                  <div className="bridal-inquiry-field">
                    <label htmlFor="bridalPartySize">BRIDAL PARTY SIZE</label>
                    <input
                      id="bridalPartySize"
                      type="text"
                      value={formData.bridalPartySize}
                      onChange={(e) => updateField("bridalPartySize", e.target.value)}
                      placeholder="e.g. 5 bridesmaids"
                    />
                  </div>
                  <div className="bridal-inquiry-field bridal-inquiry-field--full">
                    <label htmlFor="bridesmaidsMakeup">BRIDESMAIDS MAKEUP NEEDS</label>
                    <textarea
                      id="bridesmaidsMakeup"
                      value={formData.bridesmaidsMakeup}
                      onChange={(e) => updateField("bridesmaidsMakeup", e.target.value)}
                      placeholder="How many bridesmaids need makeup? Any specific preferences?"
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="bridal-inquiry-form-title">Your vision</h2>
                <p className="bridal-inquiry-form-subtitle">
                  Help us understand your style and preferences.
                </p>
                <div className="bridal-inquiry-fields">
                  <div className="bridal-inquiry-field bridal-inquiry-field--full">
                    <label htmlFor="stylePreference">STYLE PREFERENCE</label>
                    <textarea
                      id="stylePreference"
                      value={formData.stylePreference}
                      onChange={(e) => updateField("stylePreference", e.target.value)}
                      placeholder="Natural, glam, soft glam, etc. Any inspiration or reference photos?"
                      rows={3}
                    />
                  </div>
                  <div className="bridal-inquiry-field">
                    <label htmlFor="skinType">SKIN TYPE</label>
                    <select
                      id="skinType"
                      value={formData.skinType}
                      onChange={(e) => updateField("skinType", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="dry">Dry</option>
                      <option value="oily">Oily</option>
                      <option value="combination">Combination</option>
                      <option value="normal">Normal</option>
                      <option value="sensitive">Sensitive</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h2 className="bridal-inquiry-form-title">Finalise</h2>
                <p className="bridal-inquiry-form-subtitle">
                  Any last details or questions before we get in touch?
                </p>
                <div className="bridal-inquiry-fields">
                  <div className="bridal-inquiry-field bridal-inquiry-field--full">
                    <label htmlFor="notes">ADDITIONAL NOTES</label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Anything else you'd like us to know?"
                      rows={4}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="bridal-inquiry-form-footer">
              <div className="bridal-inquiry-form-footer-start">
                {step > 1 && (
                  <button
                    type="button"
                    className="bridal-inquiry-back-step"
                    onClick={() => goToStep(step - 1)}
                  >
                    ← Back
                  </button>
                )}
              </div>
              <span className="bridal-inquiry-form-pagination">{step} of 5</span>
              <div className="bridal-inquiry-form-footer-end">
                <button type="submit" className="bridal-inquiry-submit">
                  {step === 5 ? "Submit" : "Continue"}
                  <HiStar size={14} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <footer className="bridal-inquiry-footer">
        <span>@ziva_byekay</span>
        <span>+233 208 888 305</span>
        <span>Accra, Ghana</span>
        <Link to="/ekay/weddings" className="bridal-inquiry-back-link">← Back to Weddings</Link>
      </footer>
    </div>
  );
};

export default Transition(BridalInquiry);

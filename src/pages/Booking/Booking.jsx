import { useState, useEffect, useRef } from "react";
import "./Booking.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosCalendar, IoIosTime } from "react-icons/io";
import { HiCheck, HiX } from "react-icons/hi";
import SoozivaHeader from "../../components/SoozivaHeader/SoozivaHeader";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const Booking = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const bookingRef = useRef(null);

  const services = [
    {
      id: 1,
      name: "Full Face Makeup",
      duration: "90 min",
      price: 150,
      description: "Complete makeup application for any occasion",
      image: "/models/model1.JPEG",
    },
    {
      id: 2,
      name: "Bridal Makeup",
      duration: "120 min",
      price: 250,
      description: "Special bridal package with trial consultation",
      image: "/models/model2.JPEG",
    },
    {
      id: 3,
      name: "Editorial Makeup",
      duration: "120 min",
      price: 200,
      description: "Creative and artistic makeup for photoshoots",
      image: "/models/model3.JPEG",
    },
    {
      id: 4,
      name: "Natural Glam",
      duration: "60 min",
      price: 100,
      description: "Everyday natural look with a touch of glamour",
      image: "/models/model4.JPG",
    },
    {
      id: 5,
      name: "Evening Makeup",
      duration: "75 min",
      price: 130,
      description: "Glamorous look perfect for evening events",
      image: "/models/model5.JPEG",
    },
    {
      id: 6,
      name: "Makeup Lesson",
      duration: "90 min",
      price: 180,
      description: "One-on-one makeup application lesson",
      image: "/models/model6.JPEG",
    },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  // Generate available dates (next 30 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateDates();

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
    // Smooth scroll to top after step change
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      setStep(3);
      // Smooth scroll to top after step change
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to a backend
    console.log("Booking submitted:", {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      ...formData,
    });
    setBookingConfirmed(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Scroll to top on mount and step change
  useEffect(() => {
    // Use requestAnimationFrame to ensure ReactLenis is ready
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }, [step, bookingConfirmed]);

  // Ensure body overflow is reset and scroll is enabled
  useEffect(() => {
    // Force enable scrolling
    document.body.style.overflow = "";
    document.body.style.overflowY = "scroll";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "scroll";
    
    // Remove any pointer-events that might block scrolling
    const html = document.documentElement;
    const body = document.body;
    html.style.pointerEvents = "";
    body.style.pointerEvents = "";
    
    // Refresh ScrollTrigger after a brief delay to ensure layout is ready
    const refreshTimeout = setTimeout(() => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
      // Force a scroll update to ensure ReactLenis is working
      if (window.lenis) {
        window.lenis.resize();
      }
    }, 100);

    return () => {
      clearTimeout(refreshTimeout);
      document.body.style.overflow = "";
      document.body.style.overflowY = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowY = "";
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars?.targets || trigger.trigger?.closest(".booking")) {
        trigger.kill();
      }
    });

    // Configure ScrollTrigger to work with ReactLenis
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Use IntersectionObserver instead of ScrollTrigger.batch to avoid scroll conflicts
    const cards = document.querySelectorAll(".service-card, .date-card, .time-slot");
    
    if (cards.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.from(entry.target, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power2.out",
              });
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      cards.forEach((card) => {
        observer.observe(card);
      });

      return () => {
        cards.forEach((card) => {
          observer.unobserve(card);
        });
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars?.targets || trigger.trigger?.closest(".booking")) {
            trigger.kill();
          }
        });
      };
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.targets || trigger.trigger?.closest(".booking")) {
          trigger.kill();
        }
      });
    };
  }, [step]);

  if (bookingConfirmed) {
    return (
      <div className="booking" ref={bookingRef}>
        <SoozivaHeader />
        <div className="booking-container">
          <div className="booking-confirmation">
            <div className="confirmation-icon">
              <HiCheck size={64} />
            </div>
            <h1>Booking Confirmed!</h1>
            <p className="confirmation-message">
              Thank you for booking with Ziva by Ekay. We're excited to create
              something beautiful together.
            </p>
            <div className="booking-details-summary">
              <div className="summary-item">
                <span className="summary-label">Service:</span>
                <span className="summary-value">{selectedService?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Date:</span>
                <span className="summary-value">
                  {selectedDate && formatDate(selectedDate)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time:</span>
                <span className="summary-value">{selectedTime}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total:</span>
                <span className="summary-value">${selectedService?.price}</span>
              </div>
            </div>
            <div className="confirmation-actions">
              <Link to="/sooziva" className="btn btn-primary">
                Back to Home
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setBookingConfirmed(false);
                  setStep(1);
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setFormData({ name: "", email: "", phone: "", notes: "" });
                }}
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking" ref={bookingRef}>
      <SoozivaHeader />
      <div className="booking-header">
        <div className="container">
          <div className="booking-header-content">
            <div className="booking-header-text">
              <Link to="/sooziva" className="back-link">
                <IoIosArrowBack size={20} />
                <span>Back to Home</span>
              </Link>
              <h1 className="booking-title">Book Your Appointment</h1>
              <p className="booking-subtitle">
                Experience luxury beauty services at Ziva by Ekay
              </p>
            </div>
            <div className="booking-header-image">
              <img src="/models/model7.JPEG" alt="Beauty Services" />
            </div>
          </div>
        </div>
      </div>

      <div className="booking-content">
        <div className="container">
          <div className="booking-progress">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <span>Service</span>
            </div>
            <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <span>Date & Time</span>
            </div>
            <div className={`progress-line ${step >= 3 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <span>Details</span>
            </div>
          </div>

          {step === 1 && (
            <div className="booking-step">
              <h2 className="step-title">Select a Service</h2>
              <p className="step-description">
                Choose the perfect service for your needs
              </p>
              <div className="services-grid">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="service-card"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="service-image">
                      <img src={service.image} alt={service.name} />
                    </div>
                    <div className="service-header">
                      <h3>{service.name}</h3>
                      <span className="service-duration">{service.duration}</span>
                    </div>
                    <p className="service-description">{service.description}</p>
                    <div className="service-footer">
                      <span className="service-price">${service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step">
              <button
                className="back-button"
                onClick={() => {
                  setStep(1);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              >
                <IoIosArrowBack size={20} />
                Back
              </button>
              <h2 className="step-title">Select Date & Time</h2>
              <p className="step-description">
                Choose your preferred date and time slot
              </p>

              <div className="date-time-selection">
                <div className="date-selection">
                  <h3>
                    <IoIosCalendar size={20} />
                    Select Date
                  </h3>
                  <div className="dates-grid">
                    {availableDates.map((date, index) => (
                      <button
                        key={index}
                        className={`date-card ${isDateSelected(date) ? "selected" : ""}`}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="date-day">
                          {date.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="date-number">{date.getDate()}</div>
                        <div className="date-month">
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="time-selection">
                    <h3>
                      <IoIosTime size={20} />
                      Select Time
                    </h3>
                    <div className="time-slots-grid">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step">
              <button
                className="back-button"
                onClick={() => setStep(2)}
              >
                <IoIosArrowBack size={20} />
                Back
              </button>
              <h2 className="step-title">Your Details</h2>
              <p className="step-description">
                Please provide your contact information
              </p>

              <div className="booking-summary">
                <div className="summary-card">
                  <h4>Service</h4>
                  <p>{selectedService?.name}</p>
                  <span className="summary-price">${selectedService?.price}</span>
                </div>
                <div className="summary-card">
                  <h4>Date & Time</h4>
                  <p>
                    {selectedDate && formatDate(selectedDate)} at {selectedTime}
                  </p>
                </div>
              </div>

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Special Requests (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Any special requests or notes for your appointment..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                  Confirm Booking
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transition(Booking);


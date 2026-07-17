import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import h22 from '../assets/h22.jpg';
import h1 from '../assets/h1.jpg';
import h3 from '../assets/h3.jpg';
import img21 from '../assets/21.jpg';
import img23 from '../assets/23.jpg';
import img28 from '../assets/28.jpg';
import img30 from '../assets/30.jpg';
import img31 from '../assets/31.jpg';
import img36 from '../assets/36.jpg';
import img38 from '../assets/38.jpg';
import img7 from '../assets/7.jpg';
import img8 from '../assets/8.jpg';
import ph1 from '../assets/ph1.jpg';

const slideshowImages = [
  h1,
  h3,
  img21,
  img23,
  img28,
  img30,
  img31,
  img36,
  img38,
  img7,
  img8,
  ph1
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);
  };

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>KYC Youth Conference 2026</span>
          </div>
          <h1>
            <span className="hero-title-main">A Generation</span>
            <span className="hero-title-sub">Returning to the kingdom </span>
          </h1>
          <p className="hero-description">
            Join hundreds of young people for a transformative experience of worship, 
            learning, and fellowship. Register now to secure your spot and receive your 
            official registration ID and QR code.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Register Now
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-large">
              Learn More
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">600+</div>
              <div className="stat-label">Youth Expected</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Days of Impact</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Workshops</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-bg" />
          <div className="slideshow-container">
            {slideshowImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
            <button className="slideshow-nav prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="slideshow-nav next" onClick={nextSlide}>
              ›
            </button>
            <div className="slideshow-dots">
              {slideshowImages.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Register?</span>
            <h2>Everything You Need</h2>
            <p className="section-subtitle">
              Simple, fast, and secure registration process with instant benefits
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📝</span>
              </div>
              <h3>Easy Registration</h3>
              <p>Complete your registration in minutes with our simple, user-friendly form designed for your convenience.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🆔</span>
              </div>
              <h3>Unique ID</h3>
              <p>Receive your unique registration ID instantly upon completion, your key to all conference activities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📱</span>
              </div>
              <h3>QR Code</h3>
              <p>Get a personalized scannable QR code for quick check-in and access to exclusive conference features.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💳</span>
              </div>
              <h3>Digital Card</h3>
              <p>Download your official registration card to your device or print it for physical verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-tag">About the Event</span>
              <h2>KYC Youth Conference 2026</h2>
              <p className="about-lead">
                Empowering the next generation to live intentionally, walk faithfully, and lead courageously in their communities.
              </p>
              <p className="about-description">
                The KYC Youth Conference is a premier gathering of youth from across various sister churches. 
                Designed for young people aged 15-30, this event features dynamic guest speakers, immersive worship, 
                interactive workshops, and panel discussions designed to tackle modern life challenges through a biblical lens.
              </p>
              
              <div className="highlights-grid">
                <div className="highlight-card">
                  <div className="highlight-icon">⚡</div>
                  <h4>Spiritual Renewal</h4>
                  <p>Deep worship sessions and inspirational messages</p>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">💡</div>
                  <h4>Growth Workshops</h4>
                  <p>Elective classes on career, relationships, leadership</p>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">🤝</div>
                  <h4>Fellowship & Unity</h4>
                  <p>Connect with peers and build lasting friendships</p>
                </div>
              </div>

              <div className="about-cta">
                <Link to="/register" className="btn btn-primary">
                  Secure Your Spot Now
                </Link>
              </div>
            </div>
            
            <div className="about-visual">
              <div className="about-image-wrapper">
                <div className="about-image-frame" />
                <img src={h1} alt="Youth Fellowship" className="about-image" />
              </div>
              <div className="about-fact-card">
                <div className="fact-icon">🎯</div>
                <div className="fact-content">
                  <div className="fact-title">Age Group</div>
                  <div className="fact-value">15-30 Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Join Us?</h2>
              <p>
                Don't miss this opportunity to grow, connect, and be transformed. 
                Register today and take the first step towards an unforgettable experience.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Register Now
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page {
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        /* Hero Section */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100vh - 80px);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          width: fit-content;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .badge-icon {
          font-size: 1rem;
        }

        .hero h1 {
          margin: 0;
          line-height: 1.1;
        }

        .hero-title-main {
          display: block;
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .hero-title-sub {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-text);
          margin-top: 0.5rem;
        }

        .hero-description {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          max-width: 550px;
          margin: 0;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-arrow {
          font-size: 1.25rem;
          transition: transform 0.2s;
        }

        .btn-large:hover .btn-arrow {
          transform: translateX(4px);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding-top: 1rem;
        }

        .stat-item {
          text-align: left;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border);
        }

        .hero-image {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-image-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
          border-radius: 32px;
          top: 20px;
          right: -20px;
          z-index: 1;
        }

        .hero-img {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 2;
          border: 4px solid white;
        }

        /* Slideshow Styles */
        .slideshow-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 400px;
          border-radius: 24px;
          overflow: hidden;
          z-index: 2;
          border: 4px solid white;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        .slideshow-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
          z-index: 10;
        }

        .slideshow-nav:hover {
          background: white;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .slideshow-nav.prev {
          left: 12px;
        }

        .slideshow-nav.next {
          right: 12px;
        }

        .slideshow-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.9);
        }

        .dot.active {
          background: white;
          width: 28px;
          border-radius: 5px;
        }

        /* Section Styles */
        .section {
          padding: 5rem 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: var(--color-primary-light);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 0.75rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Features Section */
        .features-section {
          background: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: var(--color-bg);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
          border: 1px solid var(--color-border);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }

        .feature-icon-wrapper {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .feature-icon {
          font-size: 1.75rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 0.75rem;
        }

        .feature-card p {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* About Section */
        .about-section {
          background: linear-gradient(180deg, white 0%, var(--color-bg) 100%);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .about-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
          line-height: 1.2;
        }

        .about-lead {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.5;
          margin: 0;
        }

        .about-description {
          font-size: 1rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          margin: 0;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .highlight-card {
          background: white;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          text-align: center;
        }

        .highlight-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .highlight-card h4 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .highlight-card p {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .about-cta {
          margin-top: 1rem;
        }

        .about-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .about-image-wrapper {
          position: relative;
          width: 100%;
        }

        .about-image-frame {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px dashed var(--color-primary);
          border-radius: 20px;
          top: 16px;
          left: 16px;
          z-index: 1;
        }

        .about-image {
          position: relative;
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.2);
          z-index: 2;
          border: 4px solid white;
        }

        .about-fact-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px -10px rgba(37, 99, 235, 0.5);
          width: fit-content;
          align-self: flex-start;
        }

        .fact-icon {
          font-size: 2rem;
        }

        .fact-content {
          display: flex;
          flex-direction: column;
        }

        .fact-title {
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fact-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* CTA Section */
        .cta-section {
          background: var(--color-bg);
        }

        .cta-card {
          background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
          border-radius: 24px;
          padding: 4rem;
          text-align: center;
          color: white;
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.4);
        }

        .cta-card h2 {
          font-size: 2.5rem;
          font-weight: 800;
      margin-bottom: 1rem;
        }

        .cta-card p {
          font-size: 1.125rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.6;
        }

        .cta-card .btn-primary {
          background: white;
          color: var(--color-primary);
        }

        .cta-card .btn-primary:hover {
          background: var(--color-bg);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
            padding: 3rem 1.5rem;
          }

          .hero-content {
            align-items: center;
          }

          .hero-description {
            max-width: 100%;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-image-bg {
            display: none;
          }

          .hero-img {
            max-width: 100%;
          }

          .slideshow-container {
            max-width: 100%;
            height: 350px;
          }

          .about-grid {
            grid-template-columns: 1fr;
          }

          .about-visual {
            order: -1;
          }

          .about-image-frame {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hero-title-main {
            font-size: 2.5rem;
          }

          .hero-title-sub {
            font-size: 1.75rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-stats {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
          }

          .stat-divider {
            display: none;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .highlights-grid {
            grid-template-columns: 1fr;
          }

          .about-content h2 {
            font-size: 2rem;
          }

          .cta-card {
            padding: 2.5rem 1.5rem;
          }

          .cta-card h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 2rem 1rem;
          }

          .hero-title-main {
            font-size: 2rem;
          }

          .hero-title-sub {
            font-size: 1.5rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-large {
            width: 100%;
            justify-content: center;
          }

          .section {
            padding: 3rem 1rem;
          }

          .slideshow-container {
            height: 280px;
          }

          .slideshow-nav {
            width: 36px;
            height: 36px;
            font-size: 1.25rem;
          }

          .slideshow-nav.prev {
            left: 8px;
          }

          .slideshow-nav.next {
            right: 8px;
          }

          .dot {
            width: 8px;
            height: 8px;
          }

          .dot.active {
            width: 20px;
          }
        }
      `}</style>
    </div>
  );
}

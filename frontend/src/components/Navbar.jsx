import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import ph1 from '../assets/ph1.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar no-print">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-icon">⛪</span>
          KYC Registration
        </Link>

        <button 
          className="hamburger-menu" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/register" className={isActive('/register') ? 'active' : ''} onClick={closeMobileMenu}>
            Register
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <Link to="/participants" className={isActive('/participants') ? 'active' : ''} onClick={closeMobileMenu}>
                Participants
              </Link>
              <button onClick={() => { logout(); closeMobileMenu(); }} className="btn btn-sm btn-secondary">
                Logout ({user.role})
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: 0.875rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        .navbar-brand {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--color-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .brand-icon {
          font-size: 1.25rem;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .navbar-links a {
          color: var(--color-text-muted);
          font-size: 0.9375rem;
          font-weight: 500;
          text-decoration: none;
        }
        .navbar-links a:hover,
        .navbar-links a.active {
          color: var(--color-primary);
        }
        .hamburger-menu {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 30px;
          height: 25px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 101;
        }
        .hamburger-line {
          width: 100%;
          height: 3px;
          background: var(--color-text);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        .hamburger-line.open:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }
        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }
        .hamburger-line.open:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }
        @media (max-width: 768px) {
          .hamburger-menu {
            display: flex;
          }
          .navbar-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--color-surface);
            border-bottom: 1px solid var(--color-border);
            padding: 1rem;
            gap: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .navbar-links.mobile-open {
            max-height: 400px;
          }
          .navbar-links a,
          .navbar-links button {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--color-border);
            width: 100%;
            text-align: left;
          }
          .navbar-links button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.9375rem;
            font-weight: 500;
            color: var(--color-text-muted);
          }
          .navbar-links button:hover {
            color: var(--color-primary);
          }
          .navbar-links a:last-child,
          .navbar-links button:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </nav>
  );
}

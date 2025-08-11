// Navbar.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar sticky-top position-sticky px-4 py-2 d-flex justify-content-between align-items-center shadow-sm">
      <div className="navbar-content">
        {/* Left: Logo & Toggle Button */}
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand">         
            <img
              src="https://i.postimg.cc/mZHz3k1Q/Whats-App-Image-2025-07-23-at-12-38-03-add5b5dd-removebg-preview-1.png"
              alt="Logo"
            />
          </Link>
          <button
            className="navbar-toggler d-lg-none"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* Right: Time & Notification */}
        <div className="d-flex align-items-center">
          <div className="time-display">
            <div className="small">Current Time</div>
            <div className="fw-bold">{currentTime}</div>
          </div>

          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-label="Notification dropdown"
            >
              <i className="bi bi-bell bell-icon"></i>
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                My Profile
              </Link>
              <div className="dropdown-divider"></div>
              <Link to="/" className="dropdown-item" onClick={closeDropdown}>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
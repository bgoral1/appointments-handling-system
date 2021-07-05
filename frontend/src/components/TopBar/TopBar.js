import React, {useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import './TopBar.scss';

const TopBar = () => {
  const [scroll, setScroll] = useState("");

    useEffect(()=> {
      window.addEventListener('scroll', () => {
        let activeClass = 'topbar-scrolled';
        if(window.scrollY === 0){
            activeClass = '';
        }
        setScroll(activeClass);
      });
    }, []);


  return (
      <div className={`d-flex align-items-center fixed-top topbar ${scroll}`}>
        <div className="container d-flex justify-content-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope"></i>
            <a href="mailto:przychodnia@zabek.com" className="text-decoration-none  pe-3">przychodnia@zabek.com</a>
            <i className="bi bi-phone"></i> 62 999 99 99
          </div>
          <div className="d-none d-lg-flex social-links align-items-center">
            <NavLink to="/" className="twitter">
              <i className="bi bi-twitter"></i>
            </NavLink>
            <NavLink to="/" className="facebook">
              <i className="bi bi-facebook"></i>
            </NavLink>
            <NavLink to="/" className="instagram">
              <i className="bi bi-instagram"></i>
            </NavLink>
            <NavLink to="/" className="linkedin">
              <i className="bi bi-linkedin"></i>
            </NavLink>
          </div>
        </div>
      </div>
  );
};

export default TopBar;

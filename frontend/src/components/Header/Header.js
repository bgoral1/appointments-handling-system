import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import logo from '../../assets/images/logo_zabek.png';

import './Header.scss';
import AuthContext from '../../context/auth-context';

const Header = ({isHome}) => {
  const { token, login, logout } = useContext(AuthContext);  
  const [scroll, setScroll] = useState("");

  let home = '';
  if(isHome){
    home = 'fixed-top';
  }
    useEffect(()=> {
      window.addEventListener('scroll', () => {
        let activeClass = 'header-scrolled';
        if(window.scrollY === 0 || !isHome){
            activeClass = '';
        }
        setScroll(activeClass);
      });
    }, []);

  return (
      <header className={`border-bottom mb-4 ${home} ${scroll}`}>
      <div className="container d-flex flex-wrap align-items-center justify-content-center justify-content-md-between">
        <NavLink
          to="/"
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          <img src={logo} alt="logo" width="170px" height="72px" />
        </NavLink>
        <ul className="navbar nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
            <NavHashLink to="/#home" activeClassName="selected" className="nav-link px-2 link-dark">
             <i class="bi bi-house"></i>
            </NavHashLink>
          </li>
          <li>
            <NavHashLink to="/#about" activeClassName="selected" className="nav-link px-2 link-dark">
              O nas
            </NavHashLink>
          </li>
          <li>
            <NavHashLink to="/#services" activeClassName="selected"className="nav-link px-2 link-dark">
              Usługi
            </NavHashLink>
          </li>
          <li>
            <NavHashLink to="/#time" activeClassName="selected"className="nav-link px-2 link-dark">
              Godziny otwarcia
            </NavHashLink>
          </li>
          <li>
            <NavHashLink to="/#dentists" activeClassName="selected"className="nav-link px-2 link-dark">
              Dentyści
            </NavHashLink>
          </li>
          <li>
            <NavHashLink to="/#recommendations" activeClassName="selected"className="nav-link px-2 link-dark">
              Rekomendacje
            </NavHashLink>
          </li>
        </ul>
        <div className="col-12 col-md-3 text-end center-mobile">
          {token ? (
            <button
              type="button"
              className="btn btn-outline-primary me-2"
              onClick={logout}
            >
              Wyloguj się
            </button>
          ) : (
            <NavLink
              to="/login"
              type="button"
              className="btn btn-outline-primary me-2"
            >
              Zaloguj się
            </NavLink>
          )}
          {token && isHome && (
            <NavLink
              to="/panel"
              type="button"
              className="btn btn-primary"
            >
              Przejdź do panelu
            </NavLink>
          )}
          {!token && (
            <NavLink
              to="/appointment"
              type="button"
              className="btn btn-primary button-appointment"
            >
              Zarejstruj wizytę
            </NavLink>
          )}
        </div>
        </div>
      </header>
  );
};

export default Header;

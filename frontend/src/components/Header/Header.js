import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo_zabek.png';

import './Header.scss';

const Header = () => {
  return (
    <div class="container">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <NavLink
          to="/"
          class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          <img src={logo} alt="logo" width="170px" height="72px" />
        </NavLink>

        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <NavLink to="/" class="nav-link px-2 link-dark">
              O nas
            </NavLink>
          </li>
          <li>
            <NavLink to="/" class="nav-link px-2 link-dark">
              Usługi
            </NavLink>
          </li>
          <li>
            <NavLink to="/" class="nav-link px-2 link-dark">
              Godziny pracy
            </NavLink>
          </li>
          <li>
            <NavLink to="/" class="nav-link px-2 link-dark">
              Galeria
            </NavLink>
          </li>
        </ul>

        <div class="col-12 col-md-3 text-end center-mobile">
          <button type="button" class="btn btn-outline-primary me-2">
            Zaloguj się
          </button>
          <button type="button" class="btn btn-primary button-appointment">
            Zarejstruj wizytę
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;

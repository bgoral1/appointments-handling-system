import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo_zabek.png';

import './Header.scss';
import AuthContext from '../../context/auth-context';

const Header = () => {
  const { token, login, logout } = useContext(AuthContext);

  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <NavLink
          to="/"
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          <img src={logo} alt="logo" width="170px" height="72px" />
        </NavLink>
        {!token && (
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li>
              <NavLink to="/" className="nav-link px-2 link-dark">
                O nas
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="nav-link px-2 link-dark">
                Usługi
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="nav-link px-2 link-dark">
                Godziny pracy
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="nav-link px-2 link-dark">
                Galeria
              </NavLink>
            </li>
          </ul>
        )}
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
          <NavLink
            to="/appointment"
            type="button"
            className="btn btn-primary button-appointment"
          >
            Zarejstruj wizytę
          </NavLink>
        </div>
      </header>
    </div>
  );
};

export default Header;

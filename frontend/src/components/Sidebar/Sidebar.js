import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import './Sidebar.scss';

import AuthContext from '../../context/auth-context';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/panel" exact className="nav-link link-dark">
            Zarezerwowane wizyty
          </NavLink>
        </li>
        <li>
          <NavLink to="/panel/uslugi" className="nav-link link-dark">
            Usługi
          </NavLink>
        </li>
        <li>
          <NavLink to="/panel/dentysci" className="nav-link link-dark">
            Dentyści
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <NavLink
          to="#"
          className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
          id="dropdownUser2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </NavLink>
        <ul
          className="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser2"
        >
          <li>
            <NavLink to="#" className="dropdown-item" href="#">
              Profile
            </NavLink>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <NavLink to="#" className="dropdown-item" onClick={logout}>
              Sign out
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

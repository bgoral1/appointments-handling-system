import React from 'react';
import { NavLink } from 'react-router-dom';
import calendar from '../../assets/icons/calendar.png';

import './Sidebar.scss';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/panel" exact className="nav-link link-dark">
            {/* <img src={calendar} alt="Calendar icon" width="24" height="24" /> */}
            Zarezerwowane wizyty
          </NavLink>
        </li>
        <li>
          <NavLink to="/panel/uslugi" className="nav-link link-dark">
            Usługi
          </NavLink>
        </li>
        <li>
          <NavLink to="/panel/pracownicy" className="nav-link link-dark">
            Pracownicy
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a
          href="#"
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
        </a>
        <ul
          className="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser2"
        >
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

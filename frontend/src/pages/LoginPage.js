import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo_zabek.png';

import './Login.scss';

const LoginPage = () => {
  return (
    <div class="login-page-wrapper">
      <main class="form-signin">
        <form>
          <NavLink to="/" class="mx-auto d-block">
            <img
              src={logo}
              alt="logo"
              width="170px"
              height="72px"
              class="mb-4 mx-auto d-block"
            />
          </NavLink>
          <h1 class="h3 mb-3 fw-normal">Logowanie</h1>
          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label for="floatingInput">Email</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label for="floatingPassword">Hasło</label>
          </div>
          <button class="w-100 btn btn-lg btn-primary" type="submit">
            Zaloguj się
          </button>
          <p class="mt-5 mb-3 text-muted">&copy; 2021 Przychodnia Ząbek</p>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;

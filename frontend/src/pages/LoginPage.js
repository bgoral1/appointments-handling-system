import React, { useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo_zabek.png';

import './Login.scss';

import AuthContext from '../context/auth-context';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const loginInput = useRef(null);
  const passwordInput = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginValue = loginInput.current.value;
    const passwordValue = passwordInput.current.value;

    if (loginValue.trim().length === 0 || passwordValue.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(login: "${loginValue}", password: "${passwordValue}") {
            userId
            token
            tokenExp
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-page-wrapper">
      <main className="form-signin">
        <form onSubmit={handleSubmit}>
          <NavLink to="/" className="mx-auto d-block">
            <img
              src={logo}
              alt="logo"
              width="170px"
              height="72px"
              className="mb-4 mx-auto d-block"
            />
          </NavLink>
          <h1 className="h3 mb-3 fw-normal">Logowanie</h1>
          <div className="form-floating">
            <input
              type="login"
              className="form-control"
              id="floatingInput"
              placeholder="login"
              ref={loginInput}
            />
            <label htmlFor="floatingInput">Login</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              ref={passwordInput}
            />
            <label htmlFor="floatingPassword">Hasło</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Zaloguj się
          </button>
          <p className="mt-5 mb-3 text-muted">&copy; 2021 Przychodnia Ząbek</p>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;

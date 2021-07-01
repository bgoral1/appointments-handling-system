import React, { useContext, useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppointmentPage from './pages/AppointmentPage';
import PanelPage from './pages/PanelPage';
import AuthContext from './context/auth-context';

const App = () => {
  const [user, setUser] = useState({
    token: null,
    userId: null,
  });

  const login = (token, userId, tokenExp) => {
    setUser({ token: token, userId: userId });
  };

  const logout = () => {
    setUser({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{
            token: user.token,
            userId: user.userId,
            login: login,
            logout: logout,
          }}
        >
          <main>
            <Switch>
              {user.token && <Redirect from="/login" to="/panel" />}
              {!user.token && <Redirect from="/panel" to="/login" />}
              <Route path="/" exact component={HomePage} />
              {/* <Route path="/appointment" component={AppointmentPage} /> */}
              {!user.token && <Redirect from="/appointment" to="/" />}
              {!user.token && <Route path="/login" component={LoginPage} />}
              {user.token && <Route path="/panel" component={PanelPage} />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
};

export default App;

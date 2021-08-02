import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage';
import PanelPage from './pages/PanelPage';
import AuthContext from './context/auth-context';
import { AppointmentsContextProvider } from './context/appointments-context';
import { ServicesContextProvider } from './context/services-context';
import { DentistsContextProvider } from './context/dentists-context';
import { PatientsContextProvider } from './context/patients-context';

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
          <AppointmentsContextProvider>
            <ServicesContextProvider>
              <DentistsContextProvider>
                <PatientsContextProvider>
                  <main>
                    <Switch>
                      {user.token && <Redirect from="/login" to="/panel" />}
                      {!user.token && <Redirect from="/panel" to="/login" />}
                      <Route path="/" exact component={HomePage} />
                      {!user.token && (
                        <Route path="/login" component={LoginPage} />
                      )}
                      {user.token && (
                        <Route path="/panel" exact component={PanelPage} />
                      )}
                      {user.token && (
                        <Route path="/panel/uslugi" component={PanelPage} />
                      )}
                      {user.token && (
                        <Route path="/panel/dentysci" component={PanelPage} />
                      )}
                      {user.token && (
                        <Route path="/panel/pacjenci" component={PanelPage} />
                      )}
                    </Switch>
                  </main>
                </PatientsContextProvider>
              </DentistsContextProvider>
            </ServicesContextProvider>
          </AppointmentsContextProvider>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
};

export default App;

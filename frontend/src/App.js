import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppointmentPage from './pages/AppointmentPage';
import PanelPage from './pages/PanelPage';

const App = () => {
  return (
    <BrowserRouter>
      <>
        <main>
          <Route path="/" exact component={HomePage} />
          <Route path="/appointment" component={AppointmentPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/panel" component={PanelPage} />
        </main>
      </>
    </BrowserRouter>
  );
};

export default App;

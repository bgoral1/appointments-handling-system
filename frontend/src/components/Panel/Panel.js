import React from 'react';
import { useLocation } from 'react-router-dom';

import Sidebar from '../../components/Sidebar/Sidebar';
import ServicesPanel from './ServicesPanel/ServicesPanel';
import DentistsPanel from './DentistsPanel/DentistsPanel';
import PatientsPanel from './PatientsPanel/PatientsPanel';
import AppointmentsPanel from './AppointmentsPanel/AppointmentsPanel';
import './Panel.scss';

const Panel = (props) => {
  const location = useLocation();

  return (
    <div className="container">
      <div className="row mainPanel">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <Sidebar />
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mainHome">
          {location.pathname === '/panel' && <AppointmentsPanel />}
          {location.pathname === '/panel/uslugi' && <ServicesPanel />}
          {location.pathname === '/panel/dentysci' && <DentistsPanel />}
          {location.pathname === '/panel/pacjenci' && <PatientsPanel />}
        </main>
      </div>
    </div>
  );
};

export default Panel;

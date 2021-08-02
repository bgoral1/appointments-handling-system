import React from 'react';

import AppointmentForm from '../../../components/AppointmentForm/AppointmentForm';

const MakeAppointmentSection = () => {
  return (
    <section id="appointment">
      <div className="container">
        <div className="section-title">
          <h2>Zarezerwuj wizytę</h2>
          <p className="pb-5">
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex
            aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
            quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia
            fugiat sit in iste officiis commodi quidem hic quas.
          </p>
          <AppointmentForm isHome />
        </div>
      </div>
    </section>
  );
};

export default MakeAppointmentSection;

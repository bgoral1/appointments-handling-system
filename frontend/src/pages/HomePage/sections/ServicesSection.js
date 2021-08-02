import React, { useContext } from 'react';

import { ServicesContext } from '../../../context/services-context';
import Loader from '../../../components/Loader/Loader';
import Msg from '../../../components/Msg/Msg';

const ServicesSection = () => {
  const { services, loading, msg } = useContext(ServicesContext);

  return (
    <section id="services">
      <div className="container">
        <div className="section-title">
          <h2>Usługi</h2>
          <p>
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex
            aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
            quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia
            fugiat sit in iste officiis commodi quidem hic quas.
          </p>
          <div className="w-50 p-3 m-auto">
            {loading && <Loader />}
            {msg !== null && (
              <Msg msg={msg.content} isSuccess={msg.isSuccess} />
            )}
            {!loading && services && (
              <ul className="list-group">
                <li className="list-group-item list-group-item-secondary fw-bold d-flex justify-content-between align-items-center">
                  Nazwa usługi
                  <span className="w-25">Cena</span>
                </li>
                {services.map((service) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={service._id}
                  >
                    {service.name}
                    <span className="badge bg-primary w-25">{`${service.price} zł`}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

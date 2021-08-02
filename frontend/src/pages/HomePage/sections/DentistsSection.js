import React, { useContext } from 'react';

import { DentistsContext } from '../../../context/dentists-context';
import Loader from '../../../components/Loader/Loader';
import Msg from '../../../components/Msg/Msg';
import d1 from '../../../assets/images/d1.jpg';
import d2 from '../../../assets/images/d2.jpg';
import d3 from '../../../assets/images/d3.jpg';

const ServicesSection = () => {
  const { dentists, loading, msg } = useContext(DentistsContext);
  const docImg = [d1, d2, d3];

  return (
    <section id="dentists">
      <div className="container">
        <div className="section-title">
          <h2>Nasz zaspół</h2>
          <p>
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex
            aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
            quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia
            fugiat sit in iste officiis commodi quidem hic quas.
          </p>
          <div className="container col-xxl-8 px-4 py-5">
            <div className="row">
              {loading && <Loader />}
              {msg !== null && (
                <Msg msg={msg.content} isSuccess={msg.isSuccess} />
              )}
              {dentists &&
                dentists.map((dentist, index) => (
                  <div className="col-lg-4" key={dentist._id}>
                    <img
                      src={docImg[index]}
                      className="rounded-circle"
                      width="140"
                      height="140"
                      alt="Przychodnia Ząbek - o nas"
                      loading="lazy"
                    />
                    <h3 className="h5">{`${dentist.user.firstName} ${dentist.user.lastName}`}</h3>
                    <p className="fw-light">dentysta</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

import React, { useState, useEffect } from 'react';
import { NavHashLink } from 'react-router-hash-link';

import './HomePage.scss';

import Header from '../../components/Header/Header';
import TopBar from '../../components/TopBar/TopBar';
import Hero from '../../components/HeroSection/Hero';
import aboutImg from '../../assets/images/about.jpg';
import logo from '../../assets/images/logo_zabek.png';
import ServicesSection from './sections/ServicesSection';
import MakeAppointmentSection from './sections/MakeAppointmentSection';
import DentistsSection from './sections/DentistsSection';

const HomePage = () => {
  const [scroll, setScroll] = useState('');

  useEffect(() => {
    window.addEventListener('scroll', () => {
      let activeClass = '';
      if (window.scrollY > 20) {
        activeClass = 'showBackToTop';
      }
      setScroll(activeClass);
    });
  }, []);

  return (
    <>
      <TopBar />
      <Header isHome />
      <main id="home" className="mainHome">
        <Hero />
        <section id="about">
          <div className="container">
            <div className="section-title">
              <div className="container col-xxl-8 px-4">
                <div className="row featurette">
                  <div className="col-md-7 order-md-2">
                    <h2 className="featurette-heading">O nas</h2>
                    <p className="lead pb-2">
                      Magnam dolores commodi suscipit. Necessitatibus eius
                      consequatur ex aliquid fuga eum quidem. Sit sint
                      consectetur velit. Quisquam quos quisquam cupiditate. Et
                      nemo qui impedit suscipit alias ea. Quia fugiat sit in
                      iste officiis commodi quidem hic quas. Magnam dolores
                      commodi suscipit. Necessitatibus eius consequatur ex
                      aliquid fuga eum quidem. Sit sint consectetur velit.
                    </p>
                    <img src={logo} alt="logo" width="140px" height="59px" />
                  </div>
                  <div className="col-md-5 order-md-1">
                    <img
                      src={aboutImg}
                      className="d-block mx-lg-auto img-fluid shadow "
                      alt="Przychodnia Ząbek - o nas"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ServicesSection />
        <MakeAppointmentSection />
        <section id="time">
          <div className="container">
            <div className="section-title">
              <h2>Godziny otwarcia</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
              <div className="w-25 pt-5 m-auto">
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Poniedziałek
                    <span className="badge bg-success">8:00 - 16:00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Wtorek
                    <span className="badge bg-success">8:00 - 16:00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Środa
                    <span className="badge bg-success">8:00 - 16:00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Czwartek
                    <span className="badge bg-success">8:00 - 16:00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Piątek
                    <span className="badge bg-success">8:00 - 16:00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Sobota
                    <span className="badge bg-danger">zamknięte</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Niedziela
                    <span className="badge bg-danger">zamknięte</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <DentistsSection />
        <section id="recommendations">
          <div className="container">
            <div className="section-title">
              <h2>Rekomendacje</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer id="footer">
        <NavHashLink
          to="/#home"
          className={`back-to-top d-flex btn-primary align-items-center justify-content-center ${scroll}`}
        >
          <i className="bi bi-arrow-up-short"></i>
        </NavHashLink>
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 footer-contact">
                <h3>Ząbek</h3>
                <p>
                  ul. Nadwiślana 5 <br />
                  62-006 Warszawa <br />
                  <br />
                  <strong>Telefon:</strong> 62 999 99 99
                  <br />
                  <strong>Email:</strong>przychodnia@zabek.com
                  <br />
                </p>
              </div>

              <div className="col-lg-2 col-md-6 footer-links">
                <h4>Informacje</h4>
                <ul>
                  <li>
                    <NavHashLink to="/#about">O nas</NavHashLink>
                  </li>
                  <li>
                    <NavHashLink to="/#services">Usługi</NavHashLink>
                  </li>
                  <li>
                    <NavHashLink to="/#">Regulamin</NavHashLink>
                  </li>
                  <li>
                    <NavHashLink to="/#">Polityka Prywatności</NavHashLink>
                  </li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Oferta</h4>
                <ul>
                  <li>
                    <NavHashLink to="/#services">Wybielanie zębów</NavHashLink>
                  </li>
                  <li>
                    <NavHashLink to="/#services">Leczenie zębów</NavHashLink>
                  </li>
                  <li>
                    <NavHashLink to="/#services">Implantacja</NavHashLink>
                  </li>
                  <li>
                    <NavHashLink to="/#services">Protetyka</NavHashLink>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-6 footer-newsletter">
                <h4>Zapisz się do naszego newslettera</h4>
                <p>
                  Tamen quem nulla quae legam multos aute sint culpa legam
                  noster magna
                </p>
                <form action="" method="post">
                  <input type="email" name="email" />
                  <input type="submit" value="Subscribe" />
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="container d-md-flex py-4">
          <div className="me-md-auto text-center text-md-start">
            <div className="copyright">
              &copy; Copyright{' '}
              <strong>
                <span>Przychodnia dentystyczna "Ząbek"</span>
              </strong>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;

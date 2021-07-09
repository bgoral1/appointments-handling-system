import React, { useState, useEffect, useRef } from 'react';
import { NavHashLink } from 'react-router-hash-link';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import './HomePage.scss';

import Header from '../components/Header/Header';
import TopBar from '../components/TopBar/TopBar';
import Hero from '../components/HeroSection/Hero';
import Select from '../components/Select/Select';
import aboutImg from '../assets/images/about.jpg';
import d1 from '../assets/images/d1.jpg';
import d2 from '../assets/images/d2.jpg';
import d3 from '../assets/images/d3.jpg';
import logo from '../assets/images/logo_zabek.png';
import Loader from '../components/Loader/Loader';
import Msg from '../components/Msg/Msg';

const HomePage = () => {
  const [scroll, setScroll] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [dentistsData, setDentistsData] = useState([]);
  const [servicesData, setServiceData] = useState([]);
  const docImg = [d1, d2, d3];
  const dateElRef = useRef(null);
  const [selectVal, setSelectVal] = useState({
    service: '',
    dentist: '',
  });
  const firstNameElRef = useRef(null);
  const lastNameElRef = useRef(null);
  const phoneElRef = useRef(null);

  const moment = extendMoment(Moment);

  const handleChange = (e) => {
    e.persist();
    setMsg(null);
    if (e.target.id === 'selectService') {
      setSelectVal((prev) => ({ ...prev, service: e.target.value }));
    } else {
      setSelectVal((prev) => ({ ...prev, dentist: e.target.value }));
    }
    console.log(e.target.id);
    console.log(selectVal);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      let activeClass = '';
      if (window.scrollY > 20) {
        activeClass = 'showBackToTop';
      }
      setScroll(activeClass);
    });
  }, []);

  useEffect(() => {
    const requestBody = {
      query: `
          query{
            dentists{
              _id
              workingTime{
                startTime
                endTime
              }
              user{
                firstName
                lastName
              }
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
        setDentistsData(resData.data.dentists);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const requestBody = {
      query: `
            query{
              services{
                _id
                name
                price
                duration
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
        setServiceData(resData.data.services);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const requestBody = {
      query: `
          query{
            appointments {
              _id
              dentist {
                user {
                  firstName
                  lastName
                }
              }
              patient {
                firstName
                lastName
                phone
              }
              service {
                name
              }
              startTime
              endTime
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
        setAppointments(resData.data.appointments);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const isTimeBetween = (startTime, endTime, selectedTime) => {
    let start = moment(startTime, 'H:mm');
    let end = moment(endTime, 'H:mm');
    let selected = moment(selectedTime, 'H:mm');
    if (end < start) {
      return (
        (selected >= start && selected <= moment('23:59:59', 'h:mm:ss')) ||
        (selected >= moment('0:00:00', 'h:mm:ss') && selected < end)
      );
    }
    return selected >= start && selected < end;
  };

  const submitHandler = (e, ref) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const date = dateElRef.current.value;
    const service = selectVal.service;
    const dentist = selectVal.dentist;
    const firstName = firstNameElRef.current.value;
    const lastName = lastNameElRef.current.value;
    const phone = +phoneElRef.current.value;

    if (
      date === '' ||
      service === '' ||
      dentist === '' ||
      firstName === '' ||
      lastName === '' ||
      phone === 0
    ) {
      setLoading(false);
      setMsg({ content: 'Prosimy wypełnić wszystkie pola', isSuccess: false });
    } else {
      const day = moment(date).day();
      const selectedDentist = dentistsData.filter((obj) => {
        return obj._id === dentist;
      });
      const selectedService = servicesData.filter((obj) => {
        return obj._id === service;
      });
      const selectedRange = moment.range(
        date,
        moment(date).add(selectedService[0].duration, 'm').toDate()
      );
      const sameAppointment = appointments.find((obj) =>
        selectedRange.overlaps(moment.range(obj.startTime, obj.endTime))
      );

      if (day === 6 || day === 0) {
        setLoading(false);
        setMsg({
          content:
            'W weekendy nasz gabinet jest zamknięty, prosimy zmienić termin.',
          isSuccess: false,
        });
      } else if (
        isTimeBetween('8:00', '16:00', moment(date).format('HH:mm:ss')) !== true
      ) {
        setLoading(false);
        setMsg({
          content:
            'Gabinet czynny jest w godzinach 8:00 - 16:00. Prosimy zmienić czas wizyty.',
          isSuccess: false,
        });
      } else if (selectedDentist[0].workingTime[day] === null) {
        setLoading(false);
        setMsg({
          content: 'Wybrany dentysta nie przyjmuje w wybranym dniu tygodnia.',
          isSuccess: false,
        });
      } else if (
        isTimeBetween(
          selectedDentist[0].workingTime[day].startTime,
          selectedDentist[0].workingTime[day].endTime,
          moment(date).format('HH:mm:ss')
        ) !== true
      ) {
        setLoading(false);
        setMsg({
          content: 'Wybrany dentysta nie przyjmuje w tych godzinach.',
          isSuccess: false,
        });
      } else if (sameAppointment) {
        setLoading(false);
        setMsg({ content: 'Wybrany termin jest zajęty.', isSuccess: false });
      } else {
        let patientId;

        const requestCreatePatient = {
          query: `
            mutation {
              createPatient(patientInput: {firstName: "${firstName}", lastName: "${lastName}", phone: ${phone}}){
                _id
                firstName
                lastName
                phone
              }
            }
          `,
        };

        fetch('http://localhost:8000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestCreatePatient),
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
            patientId = resData.data.createPatient._id;
            const appointment = { date, service, dentist, patientId };
            createAppointment(appointment);
          })
          .catch((err) => {
            console.log(err);
          });

        const createAppointment = (appointment) => {
          const requestBody = {
            query: `
              mutation {
                createAppointment(appointmentInput: {startTime: "${appointment.date}", patientId: "${appointment.patientId}", serviceId: "${appointment.service}", dentistId: "${appointment.dentist}"}) {
                  _id
                  dentist {
                    user {
                      firstName
                      lastName
                    }
                  }
                  patient {
                    firstName
                    lastName
                    phone
                  }
                  service {
                    name
                    duration
                  }
                  startTime
                  endTime
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
              setLoading(false);
              setAppointments((prev) => [
                ...prev,
                resData.data.createAppointment,
              ]);
              setMsg({
                content: 'Wizyta została zarejestrowana',
                isSuccess: true,
              });
            })
            .catch((err) => {
              setLoading(false);
              setMsg({
                content:
                  'Przykro nam, ale coś poszło nie tak. Prosimy spróbować później',
                isSuccess: false,
              });
            });
        };
      }
    }
  };

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
        <section id="services">
          <div className="container">
            <div className="section-title">
              <h2>Usługi</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
              <div className="w-50 p-3 m-auto">
                <ul className="list-group">
                  <li className="list-group-item list-group-item-secondary fw-bold d-flex justify-content-between align-items-center">
                    Nazwa usługi
                    <span className="w-25">Cena</span>
                  </li>
                  {servicesData &&
                    servicesData.map((service) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={service._id}
                      >
                        {service.name}
                        <span className="badge bg-primary w-25">{`${service.price} zł`}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="appointment">
          <div className="container">
            <div className="section-title">
              <h2>Zarezerwuj wizytę</h2>
              <p className="pb-5">
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
              <form onSubmit={submitHandler}>
                <div className="row">
                  <div className="mb-3 col-sm">
                    <label htmlFor="date" className="form-label">
                      Data i godzina
                    </label>
                    <input
                      type="datetime-local"
                      id="date"
                      className="form-control"
                      min={
                        moment().add(1, 'days').format('YYYY-MM-DD') + 'T00:00'
                      }
                      max={
                        moment().add(60, 'days').format('YYYY-MM-DD') + 'T00:00'
                      }
                      ref={dateElRef}
                    />
                  </div>
                  <div className="mb-3 col-sm">
                    <label htmlFor="selectService" className="form-label">
                      Rodzaj wizyty
                    </label>
                    <Select
                      content={servicesData}
                      id="selectService"
                      itemValue={selectVal.service}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="mb-3 col-sm">
                    <label htmlFor="selectDentist" className="form-label">
                      Dentysta
                    </label>
                    <Select
                      content={dentistsData}
                      id="selectDentist"
                      itemValue={selectVal.dentist}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="mb-3 col-sm">
                    <label htmlFor="name" className="form-label">
                      Imię
                    </label>
                    <input
                      type="name"
                      id="firstName"
                      className="form-control"
                      placeholder="np. Jan"
                      ref={firstNameElRef}
                    />
                  </div>
                  <div className="mb-3 col-sm">
                    <label htmlFor="lastName" className="form-label">
                      Nazwisko
                    </label>
                    <input
                      type="name"
                      id="lastName"
                      className="form-control"
                      placeholder="np. Kowalski"
                      ref={lastNameElRef}
                    />
                  </div>
                  <div className="mb-3 col-sm">
                    <label htmlFor="phone" className="form-label">
                      Telefon
                    </label>
                    <input
                      type="number"
                      id="phone"
                      className="form-control"
                      placeholder="np. 985 965 964"
                      ref={phoneElRef}
                    />
                  </div>
                </div>
                {loading && <Loader />}
                {msg !== null && (
                  <Msg msg={msg.content} isSuccess={msg.isSuccess} />
                )}
                <button type="submit" className="btn btn-primary">
                  Zarejstruj
                </button>
              </form>
            </div>
          </div>
        </section>
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
        <section id="dentists">
          <div className="container">
            <div className="section-title">
              <h2>Nasz zaspół</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
              <div className="container col-xxl-8 px-4 py-5">
                <div className="row">
                  {dentistsData &&
                    dentistsData.map((dentist, index) => (
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
          <i class="bi bi-arrow-up-short"></i>
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

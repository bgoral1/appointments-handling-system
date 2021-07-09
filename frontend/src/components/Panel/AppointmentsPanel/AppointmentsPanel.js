import React, { useState, useRef, useEffect, useContext } from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Modal } from 'bootstrap';

import AuthContext from '../../../context/auth-context';
import ModalComp from '../../Modal/Modal';
import Table from './Table/Table';
import Select from '../../Select/Select';
import Loader from '../../Loader/Loader';
import Msg from '../../Msg/Msg';

const AppointmentsPanel = () => {
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [dentistsData, setDentistsData] = useState([]);
  const { token } = useContext(AuthContext);
  const exampleModal = useRef();
  const dateElRef = useRef(null);
  const [selectVal, setSelectVal] = useState({
    service: '',
    dentist: '',
  });
  const firstNameElRef = useRef(null);
  const lastNameElRef = useRef(null);
  const phoneElRef = useRef(null);

  const moment = extendMoment(Moment);

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

  const handleChange = (e) => {
    e.persist();
    if (e.target.id === 'selectService') {
      setSelectVal((prev) => ({ ...prev, service: e.target.value }));
    } else {
      setSelectVal((prev) => ({ ...prev, dentist: e.target.value }));
    }
    console.log(e.target.id);
    console.log(selectVal);
  };

  useEffect(() => {
    const requestBody = {
      query: `
          query{
            services{
              _id
              name
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
        setServicesData(resData.data.services);
      })
      .catch((err) => {
        console.log(err);
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
    setLoading(true);
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
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        const sortedAppointments = resData.data.appointments.sort(compare);
        setAppointments(sortedAppointments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const compare = (a, b) => {
    if (a.startTime < b.startTime) {
      return -1;
    }
    if (a.startTime > b.startTime) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    const modal = new Modal(exampleModal.current);
    setModal(modal);
  }, []);

  const modalHandler = (e, ref) => {
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
        setLoading(false);
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
              setAppointments((prev) =>
                [...prev, resData.data.createAppointment].sort(compare)
              );
              ref.current.click();
            })
            .catch((err) => {
              console.log(err);
            });
        };
      }
    }
  };

  const handleDelete = (id) => {
    const requestBody = {
      query: `
            mutation{
              cancelAppointment(appointmentId: "${id}"){
                _id
              }
            }
          `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        setAppointments((prev) =>
          prev.filter((appointment) => {
            return appointment._id !== resData.data.cancelAppointment._id;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <header className="header-normal">
        <h1>Umówione wizyty</h1>
        <button
          type="button"
          className="btn btn-round btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          title="Dodaj usługę"
        >
          +
        </button>
        <ModalComp
          ref={exampleModal}
          title="Umów wizytę"
          onSubmit={modalHandler}
        >
          <form>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Data i godzina
              </label>
              <input
                type="datetime-local"
                min={moment().add(1, 'days').format('YYYY-MM-DD') + 'T00:00'}
                max={moment().add(60, 'days').format('YYYY-MM-DD') + 'T00:00'}
                id="date"
                ref={dateElRef}
                className="form-control"
              />
            </div>
            <div className="mb-3">
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
            <div className="mb-3">
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
            <hr />
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Imię
              </label>
              <input
                type="name"
                id="firstName"
                ref={firstNameElRef}
                className="form-control"
                placeholder="np. Jan"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Nazwisko
              </label>
              <input
                type="name"
                id="lastName"
                ref={lastNameElRef}
                className="form-control"
                placeholder="np. Kowalski"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Telefon
              </label>
              <input
                type="number"
                id="phone"
                ref={phoneElRef}
                className="form-control"
                placeholder="np. 985 965 964"
              />
            </div>
          </form>
          {loading && <Loader />}
          {msg !== null && <Msg msg={msg.content} isSuccess={msg.isSuccess} />}
        </ModalComp>
      </header>
      {loading ? (
        <Loader />
      ) : (
        <Table content={appointments} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default AppointmentsPanel;

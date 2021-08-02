import React, { useContext, useState, useRef } from 'react';
import moment from 'moment';

import { isTimeBetween } from '../../helpers/dateRange/isTimeBetween';
import { sortObjectsByKeValue } from '../../helpers/sortingObjFunc/sortObjectByKeyValue';
import { ServicesContext } from '../../context/services-context';
import { DentistsContext } from '../../context/dentists-context';
import { AppointmentsContext } from '../../context/appointments-context';
import ConditionalWrapper from '../../components/ConditionalWrapper/ConditionalWrapper';
import ModalComp from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';
import Msg from '../../components/Msg/Msg';
import Select from '../../components/Select/Select';

const AppointmentForm = ({ isHome }) => {
  const { services } = useContext(ServicesContext);
  const { dentists } = useContext(DentistsContext);
  const { appointments, setAppointments, loading, setLoading, msg, setMsg } =
    useContext(AppointmentsContext);

  const dateElRef = useRef(null);
  const [selectVal, setSelectVal] = useState({
    service: '',
    dentist: '',
  });
  const firstNameElRef = useRef(null);
  const lastNameElRef = useRef(null);
  const phoneElRef = useRef(null);

  const handleChange = (e) => {
    e.persist();
    setMsg(null);
    if (e.target.id === 'selectService') {
      setSelectVal((prev) => ({ ...prev, service: e.target.value }));
    } else {
      setSelectVal((prev) => ({ ...prev, dentist: e.target.value }));
    }
  };

  const submitHandler = (e, modal) => {
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
      const selectedDentist = dentists.filter((obj) => {
        return obj._id === dentist;
      });
      const selectedService = services.filter((obj) => {
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
            setMsg({ content: err.message, isSuccess: false });
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
              setAppointments((prev) =>
                sortObjectsByKeValue(
                  [...prev, resData.data.createAppointment],
                  'startTime'
                )
              );
              setMsg({
                content: 'Wizyta została zarejestrowana',
                isSuccess: true,
              });
              if (modal) {
                setTimeout(() => modal.hide(), 2000);
              }
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

  let displayClass = null;
  if (isHome) {
    displayClass = 'col-sm';
  }

  const renderForm = (isHome) => {
    return (
      <ConditionalWrapper
        condition={!isHome}
        wrapper={(children) => (
          <ModalComp title="Umów wizytę" onSubmit={submitHandler}>
            {children}
          </ModalComp>
        )}
      >
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className={`mb-3 ${displayClass}`}>
              <label htmlFor="date" className="form-label">
                Data i godzina
              </label>
              <input
                type="datetime-local"
                id="date"
                className="form-control"
                min={moment().add(1, 'days').format('YYYY-MM-DD') + 'T00:00'}
                max={moment().add(60, 'days').format('YYYY-MM-DD') + 'T00:00'}
                ref={dateElRef}
              />
            </div>
            <div className={`mb-3 ${displayClass}`}>
              <label htmlFor="selectService" className="form-label">
                Rodzaj wizyty
              </label>
              <Select
                content={services}
                id="selectService"
                itemValue={selectVal.service}
                handleChange={handleChange}
              />
            </div>
            <div className={`mb-3 ${displayClass}`}>
              <label htmlFor="selectDentist" className="form-label">
                Dentysta
              </label>
              <Select
                content={dentists}
                id="selectDentist"
                itemValue={selectVal.dentist}
                handleChange={handleChange}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className={`mb-3 ${displayClass}`}>
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
            <div className={`mb-3 ${displayClass}`}>
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
            <div className={`mb-3 ${displayClass}`}>
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
          {msg !== null && <Msg msg={msg.content} isSuccess={msg.isSuccess} />}
          {isHome && (
            <button type="submit" className="btn btn-primary">
              Zarejstruj
            </button>
          )}
        </form>
      </ConditionalWrapper>
    );
  };

  return renderForm(isHome);
};

export default AppointmentForm;

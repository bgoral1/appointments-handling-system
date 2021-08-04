import React, { useContext } from 'react';

import AuthContext from '../../../context/auth-context';
import { AppointmentsContext } from '../../../context/appointments-context';
import AppointmentForm from '../../../components/AppointmentForm/AppointmentForm';
import Table from './Table/Table';
import Loader from '../../../components/Loader/Loader';
import Msg from '../../../components/Msg/Msg';

const AppointmentsPanel = () => {
  const { token } = useContext(AuthContext);
  const { appointments, setAppointments, loading, setLoading, msg, setMsg } =
    useContext(AppointmentsContext);

  const handleDelete = (id) => {
    setLoading(true);
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
          setLoading(false);
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
        setLoading(false);
      })
      .catch((err) => {
        setMsg({ content: err.message, isSuccess: false });
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
          data-bs-target="#modal"
          title="Dodaj usługę"
        >
          +
        </button>
        <AppointmentForm />
      </header>
      {appointments && (
        <Table content={appointments} handleDelete={handleDelete} />
      )}
      {loading && <Loader />}
      {msg !== null && <Msg msg={msg.content} isSuccess={msg.isSuccess} />}
    </>
  );
};

export default AppointmentsPanel;

import React, { useState, useEffect } from 'react';
import { sortObjectsByKeyValue } from './../helpers/sortingObjFunc/sortObjectByKeyValue';

export const AppointmentsContext = React.createContext();

export const AppointmentsContextProvider = ({ children }) => {
  const queryAppointments = `
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
`;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: queryAppointments,
    };

    fetch(process.env.REACT_APP_API_URL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          setLoading(false);
          throw new Error(
            'Wystąpił problem, prosimy spróbować ponownie później'
          );
        }
        return res.json();
      })
      .then((resData) => {
        setAppointments(
          sortObjectsByKeyValue(resData.data.appointments, 'startTime')
        );
        setLoading(false);
      })
      .catch((err) => {
        setMsg({ content: err.message, isSuccess: false });
      });
  }, [queryAppointments]);

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        setAppointments,
        loading,
        setLoading,
        msg,
        setMsg,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

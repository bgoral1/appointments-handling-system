import React, { useState, useEffect } from 'react';
import { sortObjectsByKeyValue } from './../helpers/sortingObjFunc/sortObjectByKeyValue';

export const PatientsContext = React.createContext();

export const PatientsContextProvider = ({ children }) => {
  const API_URL = 'http://localhost:8000/graphql';

  const queryPatients = `
  query{
    patients {
      _id
      firstName
      lastName
      phone
    }
  }
`;

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: queryPatients,
    };

    fetch(API_URL, {
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
        setPatients(sortObjectsByKeyValue(resData.data.patients, 'lastName'));
        setLoading(false);
      })
      .catch((err) => {
        setMsg({ content: err.message, isSuccess: false });
      });
  }, [queryPatients]);

  return (
    <PatientsContext.Provider
      value={{ patients, setPatients, loading, setLoading, msg, setMsg }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';

export const DentistsContext = React.createContext();

export const DentistsContextProvider = ({ children }) => {
  const queryDentists = `
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
  `;

  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: queryDentists,
    };

    fetch(process.env.API_URL, {
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
        setDentists(resData.data.dentists);
        setLoading(false);
      })
      .catch((err) => {
        setMsg({ content: err.message, isSuccess: false });
      });
  }, [queryDentists]);

  return (
    <DentistsContext.Provider
      value={{ dentists, setDentists, loading, setLoading, msg }}
    >
      {children}
    </DentistsContext.Provider>
  );
};

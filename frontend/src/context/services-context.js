import React, { useState, useEffect } from 'react';

export const ServicesContext = React.createContext();

export const ServicesContextProvider = ({ children }) => {
  const API_URL = 'http://localhost:8000/graphql';

  const queryServices = `
  query{
    services{
      _id
      name
      price
      duration
    }
  }
  `;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: queryServices,
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
        setServices(resData.data.services);
        setLoading(false);
      })
      .catch((err) => {
        setMsg({ content: err.message, isSuccess: false });
      });
  }, [queryServices]);

  return (
    <ServicesContext.Provider
      value={{ services, setServices, loading, setLoading, msg, setMsg }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

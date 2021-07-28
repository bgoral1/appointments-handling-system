import { useState, useEffect } from 'react';

export const useFetchData = (queryToRequest) => {
  const API_URL = 'http://localhost:8000/graphql';

  const [data, setData] = useState([]);
  const [loadingFetchData, setLoading] = useState(false);
  const [msgFetchData, setMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: queryToRequest,
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
        setData(resData.data);
        setLoading(false);
      })
      .catch((err) => {
        setMsg({ content: err.message, isSuccess: false });
      });
  }, []);

  return { ...data, loadingFetchData, msgFetchData };
};

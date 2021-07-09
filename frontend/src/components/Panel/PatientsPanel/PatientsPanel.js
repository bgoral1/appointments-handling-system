import React, { useState, useEffect, useContext } from 'react';

import AuthContext from '../../../context/auth-context';
import Table from './Table/Table';
import Loader from '../../Loader/Loader';

const PatientsPanel = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const compare = (a, b) => {
    if (a.lastName < b.lastName) {
      return -1;
    }
    if (a.lastName > b.lastName) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: `
          query{
            patients {
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
        setPatients(resData.data.patients.sort(compare));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    const requestBody = {
      query: `
            mutation{
              deletePatient(patientId: "${id}"){
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
        setPatients((prev) =>
          prev.filter((patient) => {
            return patient._id !== resData.data.deletePatient._id;
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
        <h1>Pacjenci</h1>
      </header>
      {loading ? (
        <Loader />
      ) : (
        <Table content={patients} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default PatientsPanel;

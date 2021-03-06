import React, { useContext } from 'react';

import AuthContext from '../../../context/auth-context';
import { PatientsContext } from '../../../context/patients-context';
// import { sortObjectsByKeyValue } from '../../../helpers/sortingObjFunc/sortObjectByKeyValue';
import Table from './Table/Table';
import Loader from '../../Loader/Loader';
import Msg from '../../../components/Msg/Msg';

const PatientsPanel = () => {
  const { patients, setPatients, loading, setLoading, msg, setMsg } =
    useContext(PatientsContext);
  const { token } = useContext(AuthContext);

  // if (patients !== []) {
  //   setPatients(sortObjectsByKeyValue(patients, 'lastName'));
  // }

  const handleDelete = (id) => {
    setLoading(true);
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

    fetch(process.env.REACT_APP_API_URL, {
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
        setPatients((prev) =>
          prev.filter((patient) => {
            return patient._id !== resData.data.deletePatient._id;
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
        <h1>Pacjenci</h1>
      </header>
      {patients && <Table content={patients} handleDelete={handleDelete} />}
      {loading && <Loader />}
      {msg !== null && <Msg msg={msg.content} isSuccess={msg.isSuccess} />}
    </>
  );
};

export default PatientsPanel;

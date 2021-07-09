import React, { useState, useEffect, useContext } from 'react';

import AuthContext from '../../../context/auth-context';
import Loader from '../../Loader/Loader';

const DentistsPanel = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const weekDays = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: `
          query{
            dentists {
              _id
              workingTime{
                startTime
                endTime
              }
              user {
                firstName
                lastName
                login
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
        setDentists(resData.data.dentists);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <header className="header-normal">
        <h1>Dentyści</h1>
      </header>
      {loading ? (
        <Loader />
      ) : (
        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
          {dentists.map((dentist) => (
            <div className="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">{`${dentist.user.firstName} ${dentist.user.lastName}`}</h4>
                </div>
                <div class="card-body">
                  <ul class="list-unstyled mt-3 mb-4">
                    {dentist.workingTime.slice(1,6).map((day, index) =>
                      day !== null ? (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          {weekDays[index]}
                          <span className="badge bg-success">
                            {`${day.startTime} - ${day.endTime}`}
                          </span>
                        </li>
                      ) : (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          {weekDays[index]}
                          <span className="badge bg-secondary">--------</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DentistsPanel;

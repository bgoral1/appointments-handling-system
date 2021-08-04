import React, { useContext } from 'react';

import { DentistsContext } from '../../../context/dentists-context';
import Loader from '../../Loader/Loader';
import Msg from '../../../components/Msg/Msg';

const DentistsPanel = () => {
  const { dentists, loading, msg } = useContext(DentistsContext);
  const weekDays = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];

  return (
    <>
      <header className="header-normal">
        <h1>Dentyści</h1>
      </header>
      {dentists && (
        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
          {dentists.map((dentist) => (
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm">
                <div className="card-header py-3">
                  <h4 className="my-0 fw-normal">{`${dentist.user.firstName} ${dentist.user.lastName}`}</h4>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mt-3 mb-4">
                    {dentist.workingTime.slice(1, 6).map((day, index) =>
                      day !== null ? (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {weekDays[index]}
                          <span className="badge bg-success">
                            {`${day.startTime} - ${day.endTime}`}
                          </span>
                        </li>
                      ) : (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
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
      {loading && <Loader />}
      {msg !== null && <Msg msg={msg.content} isSuccess={msg.isSuccess} />}
    </>
  );
};

export default DentistsPanel;

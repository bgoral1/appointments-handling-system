import React, { useRef, useContext } from 'react';

import AuthContext from '../../../context/auth-context';
import { ServicesContext } from '../../../context/services-context';
import ModalComp from '../../../components/Modal/Modal';
import Table from './Table/Table';
import Loader from '../../Loader/Loader';
import Msg from '../../../components/Msg/Msg';

const ServicesPanel = () => {
  const { services, setServices, loading, setLoading, msg, setMsg } =
    useContext(ServicesContext);
  const { token } = useContext(AuthContext);
  const nameElRef = useRef(null);
  const priceElRef = useRef(null);
  const durationElRef = useRef(null);

  const submitHandler = (e, modal) => {
    e.preventDefault();
    const name = nameElRef.current.value;
    const price = +priceElRef.current.value;
    const duration = +durationElRef.current.value;

    if (name.trim().length === 0 || price <= 0 || price <= 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createService(serviceInput: {name: "${name}", duration: ${duration}, price: ${price}}){
            _id
            name
            price
            duration
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        setLoading(false);
        setServices((prev) => [...prev, resData.data.createService]);
        if (modal) {
          setTimeout(() => modal.hide(), 500);
        }
      })
      .catch((err) => {
        setLoading(false);
        setMsg({ content: err.message, isSuccess: false });
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    const requestBody = {
      query: `
            mutation{
              deleteService(serviceId: "${id}"){
                _id
                name
                duration
                price
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        setServices((prev) =>
          prev.filter((service) => {
            return service._id !== resData.data.deleteService._id;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setMsg({ content: err.message, isSuccess: false });
      });
  };

  return (
    <>
      <header className="header-normal">
        <h1>Usługi</h1>
        <button
          type="button"
          className="btn btn-round btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          title="Dodaj usługę"
        >
          +
        </button>
        <ModalComp title="Dodaj usługę" onSubmit={submitHandler}>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nazwa
              </label>
              <input
                type="name"
                id="name"
                ref={nameElRef}
                className="form-control"
                placeholder="np. Wizyta kontrolna"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Cena (zł)
              </label>
              <input
                type="number"
                id="price"
                ref={priceElRef}
                className="form-control"
                placeholder="np. 100"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="duration" className="form-label">
                Czas trwania (min)
              </label>
              <input
                type="number"
                id="duration"
                ref={durationElRef}
                className="form-control"
                placeholder="np. 20"
              />
            </div>
          </form>
        </ModalComp>
      </header>
      {services && <Table content={services} handleDelete={handleDelete} />}
      {loading && <Loader />}
      {msg !== null && <Msg msg={msg.content} isSuccess={msg.isSuccess} />}
    </>
  );
};

export default ServicesPanel;

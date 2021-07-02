import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal } from 'bootstrap';

import AuthContext from '../../../context/auth-context';
import ModalComp from '../../../components/Modal/Modal';
import Table from './Table/Table';
import Loader from '../../Loader/Loader';

const ServicesPanel = () => {
  const [modal, setModal] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const exampleModal = useRef();
  const nameElRef = useRef(null);
  const priceElRef = useRef(null);
  const durationElRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const requestBody = {
      query: `
          query{
            services{
              _id
              name
              duration
              price
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
        setServices(resData.data.services);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setModal(new Modal(exampleModal.current));
  }, []);

  const modalHandler = (e) => {
    e.preventDefault();
    const name = nameElRef.current.value;
    const price = +priceElRef.current.value;
    const duration = +durationElRef.current.value;

    if (name.trim().length === 0 || price <= 0 || price <= 0) {
      return;
    }

    const service = { name, price, duration };

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
        console.log(resData);
        setServices((prev) => [...prev, resData.data.createService]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
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
        setServices((prev) =>
          prev.filter((service) => {
            return service._id !== resData.data.deleteService._id;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <header>
        <h1>Usługi</h1>
        <button
          type="button"
          className="btn btn-round"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          title="Dodaj usługę"
        >
          +
        </button>
        <ModalComp
          ref={exampleModal}
          title="Dodaj usługę"
          onSubmit={modalHandler}
        >
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
      {loading ? (
        <Loader />
      ) : (
        <Table content={services} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default ServicesPanel;

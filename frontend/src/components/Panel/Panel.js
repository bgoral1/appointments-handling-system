import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal } from 'bootstrap';

import AuthContext from '../../context/auth-context';
import Sidebar from '../../components/Sidebar/Sidebar';
import ModalComp from '../../components/Modal/Modal';
import './Panel.scss';

const Panel = () => {
  const [modal, setModal] = useState(null);
  const [services, setServices] = useState([]);
  const { token } = useContext(AuthContext);
  const exampleModal = useRef();
  const nameElRef = useRef(null);
  const priceElRef = useRef(null);
  const durationElRef = useRef(null);

  useEffect(() => {
    const requestBody = {
      query: `
          query{
            services{
              name
              duration
              price
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setServices(resData.data.services);
      })
      .catch(err => {
        console.log(err);
      });
  }, [services]);

  useEffect(() => {
    setModal(new Modal(exampleModal.current));
  }, []);

  const modalHandler = (e) => {
    e.preventDefault();
    const name = nameElRef.current.value;
    const price = +priceElRef.current.value;
    const duration = +durationElRef.current.value;

    if (
      name.trim().length === 0 ||
      price <= 0 ||
      price <= 0 
    ) {return}
      

    const service = {name, price, duration};

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
        'Authorization': 'Bearer ' + token
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

   const fetchServices = () => {
    
   }

  return (
    <div className="container">
      <div className="row mainPanel">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <Sidebar />
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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
            <ModalComp ref={exampleModal} title="Dodaj usługę" onSubmit={modalHandler}>
               <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nazwa</label>
                  <input type="name" id="name" ref={nameElRef} className="form-control" placeholder="np. Wizyta kontrolna"/>
                  </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Cena (zł)</label>
                  <input type="number" id="price" ref={priceElRef} className="form-control" placeholder="np. 100"/>
                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Czas trwania (min)</label>
                  <input type="number" id="duration" ref={durationElRef} className="form-control" placeholder="np. 20"/>
                </div>
            </form>
            </ModalComp>
          </header>
          {services !== undefined && services !== [] && ( <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">Nazwa</th>
                  <th scope="col">Cena</th>
                  <th scope="col">Czas trwania</th>
                </tr>
              </thead>
              <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.price + " zł"}</td>
                  <td>{service.duration + " min"}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>)}
         
        </main>
      </div>
    </div>
  );
};

export default Panel;

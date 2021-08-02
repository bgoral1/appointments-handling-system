import React, { useRef, useEffect, useState } from 'react';
import { Modal } from 'bootstrap';

const ModalComp = (props) => {
  const modalDOM = useRef();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const modal = new Modal(modalDOM.current);
    setModal(modal);
  }, []);

  return (
    <div
      className="modal fade"
      id="modal"
      tabIndex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
      ref={modalDOM}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title font-weight-bold">{props.title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{props.children}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Anuluj
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => props.onSubmit(e, modal)}
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComp;

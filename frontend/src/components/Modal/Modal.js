import React, { useRef } from 'react';

import './Modal.scss';

const Modal = (props) => {
  const closeModalRef = useRef();

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
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
              ref={closeModalRef}
            >
              Zamknij
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => props.onSubmit(e, closeModalRef)}
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

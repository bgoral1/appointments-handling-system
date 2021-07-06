import React from 'react';
import hero from '../../assets/images/hero.svg';

const Hero = () => {
  return (
    <div className="container col-xxl-8 px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6 py-5">
          <img
            src={hero}
            className="d-block mx-lg-auto img-fluid"
            alt="Przychodnia Ząbek - hero image"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold lh-1 mb-3">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button
              type="button"
              className="btn btn-secondary btn-md px-4 me-md-2"
            >
              Dowiedz się więcej
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

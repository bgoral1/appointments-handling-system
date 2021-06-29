import React from 'react';
import hero from '../../assets/images/hero.png';

const Hero = () => {
  return (
    <div class="container col-xxl-8 px-4 py-5">
      <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div class="col-10 col-sm-8 col-lg-6">
          <img
            src={hero}
            class="d-block mx-lg-auto img-fluid"
            alt="Logo Przychodni Ząbek"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
        <div class="col-lg-6">
          <h1 class="display-5 fw-bold lh-1 mb-3">
            Lorem ipsum dolor sit amet
          </h1>
          <p class="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation
          </p>
          <div class="d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="button" class="btn btn-primary btn-lg px-4 me-md-2">
              Dowiedz się więcej
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

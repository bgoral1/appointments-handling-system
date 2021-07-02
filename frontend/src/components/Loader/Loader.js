import React from 'react';

import './Loader.scss';

const Loader = () => {
  return (
    <div className="d-flex justify-content-center loader">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;

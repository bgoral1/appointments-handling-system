import React from 'react';

const Msg = ({msg, isSuccess}) => {
  let msgType = "alert-success";
  if(!isSuccess) {
    msgType = "alert-danger";
  }
  
  return (
    <div class={`alert ${msgType}`} role="alert">{msg}</div>
  );
};

export default Msg;

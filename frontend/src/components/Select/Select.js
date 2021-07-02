import React, { useState } from 'react';

const Select = (props) => {
  const { content, itemValue, handleChange, id } = props;

  return (
    <select
      id={id}
      className="form-select"
      value={itemValue}
      onChange={handleChange}
    >
      <option defaultValue="null">Wybierz</option>
      {content.map((item) => (
        <option value={item._id} key={item._id}>
          {item.name !== undefined
            ? item.name
            : item.user.firstName + ' ' + item.user.lastName}
        </option>
      ))}
    </select>
  );
};

export default Select;

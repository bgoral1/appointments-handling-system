import React from 'react';
import moment from 'moment';

const TableRow = (props) => {
  const { content, index, handleDelete } = props;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{moment(content.startTime).format('DD-MM-YYYY HH:mm')}</td>
      <td>{content.patient.lastName + ' ' + content.patient.firstName}</td>
      <td>{content.patient.phone}</td>
      <td>{content.service.name}</td>
      <td>
        {content.dentist.user.lastName + ' ' + content.dentist.user.firstName}
      </td>
      <td>
        <button
          className="btn btn-outline-danger"
          type="submit"
          value="Submit"
          onClick={() => handleDelete(content._id)}
        >
          x
        </button>
      </td>
    </tr>
  );
};

export default TableRow;

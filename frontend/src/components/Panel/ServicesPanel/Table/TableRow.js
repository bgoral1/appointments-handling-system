import React from 'react';

const TableRow = (props) => {
  const { content, index, handleDelete } = props;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{content.name}</td>
      <td>{content.price + ' zł'}</td>
      <td>{content.duration + ' min'}</td>
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

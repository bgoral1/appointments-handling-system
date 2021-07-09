import React from 'react';

const TableRow = (props) => {
  const { content, index, handleDelete } = props;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{content.lastName}</td>
      <td>{content.firstName}</td>
      <td>{content.phone}</td>
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

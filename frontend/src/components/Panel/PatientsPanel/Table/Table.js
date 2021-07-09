import React from 'react';
import TableRow from './TableRow';

const Table = (props) => {
  const { content, handleDelete } = props;
  if (content === undefined) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nazwisko</th>
            <th scope="col">Imię</th>
            <th scope="col">Telefon</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {content.map((item, index) => (
            <TableRow
              content={item}
              index={index}
              handleDelete={handleDelete}
              key={item._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

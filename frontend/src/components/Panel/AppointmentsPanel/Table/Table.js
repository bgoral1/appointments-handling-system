import React from 'react';
import TableRow from './TableRow';
// import Loader from '../../../Loader/Loader';

const Table = (props) => {
  const { content, handleDelete } = props;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Data i godzina</th>
            <th scope="col">Pacjent</th>
            <th scope="col">Telefon</th>
            <th scope="col">Usługa</th>
            <th scope="col">Dentysta</th>
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

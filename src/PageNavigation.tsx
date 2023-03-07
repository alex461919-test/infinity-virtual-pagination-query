import React from 'react';
import { useQuery } from 'react-query';
import { fetchPage, FetchResult } from './fetchApi';
import Pagination from './Pagination';
import { useLoadingSpinnerControl } from './Spinner';

const PAGE_SIZE = 10;

const PageNavigation: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const query = useQuery<FetchResult, Error>(['Users', page], () => fetchPage(page, PAGE_SIZE), {
    retry: false,
    keepPreviousData: true,
  });

  const { isError, error, data, isFetching, isPreviousData } = query;

  const { showLoadingSpinner } = useLoadingSpinnerControl();

  React.useEffect(() => {
    if (isFetching) return showLoadingSpinner();
  }, [showLoadingSpinner, isFetching]);

  if (isError) return <div className="alert alert-danger">{error.message}</div>;
  if (!data) return null;

  const {
    items,
    pageInfo: { totalCount, pageSize, currentPage, totalPages },
  } = data;

  return (
    <>
      <h1 className="h5 my-4">Постраничная навигация</h1>
      {totalPages > 1 ? (
        <Pagination
          {...{ totalCount, pageSize, siblingCount: 2, currentPage, onChangePage: setPage, disabled: isPreviousData }}
          className="my-3"
        />
      ) : null}
      <table className="table table-sm table-borderless my-3">
        <thead className="table-info">
          <tr>
            <th>id</th>
            <th>Email</th>
            <th>Имя</th>
          </tr>
        </thead>
        <tbody>
          {items.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{`${user.lastName} ${user.firstName}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PageNavigation;

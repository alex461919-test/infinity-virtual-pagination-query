/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useInfiniteQuery } from 'react-query';
import fetchPage, { FetchResult } from './fetchApi';
import { useLoadingSpinnerControl } from './Spinner';

const PAGE_SIZE = 20;
//
const InfinityScroll: React.FC = () => {
  const query = useInfiniteQuery<FetchResult, Error>(['Users', 'Infinity'], ({ pageParam = 1 }) => fetchPage(pageParam, PAGE_SIZE), {
    getNextPageParam: (lastPage, pages) => lastPage.pageInfo.nextPage,
  });
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isError } = query;

  const { showLoadingSpinner } = useLoadingSpinnerControl();

  React.useEffect(() => {
    if (isFetching) return showLoadingSpinner();
  }, [showLoadingSpinner, isFetching]);

  const handleScroll = React.useCallback<React.UIEventHandler<HTMLElement>>(
    event => {
      const el = event.nativeEvent.target as Element;
      const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (scrollBottom < 30 && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  if (isError) return <div className="alert alert-danger">{error.message}</div>;
  if (!data) return null;

  const list = data.pages.flatMap(page => page.items);

  return (
    <>
      <h1 className="h5 my-4">Бесконечная прокрутка</h1>
      <table css={tableStyle} onScroll={handleScroll}>
        <thead>
          <tr>
            <th>id</th>
            <th>Email</th>
            <th>Имя</th>
          </tr>
        </thead>
        <tbody>
          {list.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{`${user.lastName} ${user.firstName}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="btn btn-primary my-3">
          Загрузить еще
        </button>
      </div>
    </>
  );
};
const tableStyle = css`
  display: grid;
  grid-template-columns: repeat(3, auto);
  overflow-y: auto;
  max-height: 300px;
  position: relative;
  thead,
  tbody,
  tr {
    display: contents;
  }
  thead th {
    position: sticky;
    top: 0px;
    background-color: teal;
    color: white;
  }
  th,
  td {
    padding: 0.5rem 1rem;
  }
`;

export default InfinityScroll;

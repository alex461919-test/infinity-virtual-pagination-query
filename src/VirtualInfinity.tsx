/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { useInfiniteQuery } from 'react-query';
import fetchPage, { FetchResult } from './fetchApi';
import { useLoadingSpinnerControl } from './Spinner';

const PAGE_SIZE = 20;

const VirtualInfinity: React.FC = () => {
  const bodyRef = React.useRef(null);

  const query = useInfiniteQuery<FetchResult, Error>(['Users', 'VirtualInfinity'], ({ pageParam = 1 }) => fetchPage(pageParam, PAGE_SIZE), {
    getNextPageParam: (lastPage, pages) => lastPage.pageInfo.nextPage,
    getPreviousPageParam: (lastPage, pages) => lastPage.pageInfo.prevPage,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isError } = query;

  const { showLoadingSpinner } = useLoadingSpinnerControl();

  React.useEffect(() => {
    if (isFetching) return showLoadingSpinner();
  }, [showLoadingSpinner, isFetching]);

  const rows = React.useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const lastItem = rowVirtualizer.getVirtualItems().at(-1);

  React.useEffect(() => {
    if (lastItem !== undefined && lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, lastItem, rows.length]);

  if (isError) return <div className="alert alert-danger">{error.message}</div>;
  if (!data) return null;

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Подсчет смещений заголока с учетом полосы прокрутки и бордера тела таблицы
  let headPaddingRight = '0px';
  let headPaddingLeft = '0px';
  if (bodyRef.current) {
    const element = bodyRef.current as HTMLElement;
    const cStyles = window.getComputedStyle(element);
    headPaddingRight = `calc(${element.offsetWidth - element.clientWidth}px - ${cStyles.borderLeftWidth} - ${cStyles.borderRightWidth})`;
    headPaddingLeft = cStyles.borderLeftWidth;
  }

  return (
    <>
      <h1 className="h5 my-4">Виртуальный бесконечный список</h1>
      <div css={tableStyle}>
        <div className="container thead">
          <div className="row" style={{ paddingLeft: headPaddingLeft, paddingRight: headPaddingRight }}>
            <div className="col-2 cell">id</div>
            <div className="col-5 cell">Email</div>
            <div className="col-5 cell">Имя</div>
          </div>
        </div>

        <div ref={bodyRef} className="tbody">
          <div className="position-relative" style={{ height: rowVirtualizer.getTotalSize() }}>
            <div className="container position-absolute" style={{ top: virtualItems[0]?.start ?? 0 }}>
              {virtualItems.map(item => {
                const user = rows[item.index];
                return (
                  <div key={user.id} data-index={item.index} ref={rowVirtualizer.measureElement} className="row">
                    <div className="col-2 cell">{user.id}</div>
                    <div className="col-5 cell">{user.email}</div>
                    <div className="col-5 cell">{`${user.lastName} ${user.firstName}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="text-end">
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="btn btn-primary my-3">
          Загрузить еще
        </button>
      </div>
    </>
  );
};

const tableStyle = css`
  .thead {
    background-color: teal;
    color: white;
  }
  .tbody {
    overflow-y: auto;
    height: 300px;
  }
  .cell {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

export default VirtualInfinity;

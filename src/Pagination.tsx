import React from 'react';
import { IPaginationParams, usePagination } from './usePagination';

const Pagination: React.FC<IPaginationParams & { disabled?: boolean; onChangePage?: (n: number) => void }> = ({
  totalCount,
  pageSize,
  siblingCount = 2,
  currentPage,
  disabled = false,
  onChangePage = () => {},
}) => {
  const pagination = usePagination({ totalCount, pageSize, siblingCount, currentPage });
  const clickHandler = React.useCallback<React.MouseEventHandler<HTMLElement>>(
    event => {
      event.preventDefault();
      const page = Number((event.target as HTMLElement).dataset.page);
      page && onChangePage(page);
    },
    [onChangePage],
  );
  const totalPages = Math.ceil(totalCount / pageSize);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  return (
    <ul className="pagination pagination-sm user-select-none" onClick={clickHandler}>
      <li className={'page-item' + (disabled || !prevPage ? ' disabled' : '')}>
        <a className="page-link" data-page={prevPage} href={'#' + (prevPage ?? '')}>
          {'\u003c'}
        </a>
      </li>

      {pagination.map(item => {
        return (
          <li key={item.pageN} className={'page-item' + (item.pageN === currentPage ? ' active' : '') + (disabled ? ' disabled' : '')}>
            <a className="page-link" data-page={item.pageN} href={'#' + item.pageN}>
              {item.type === 'dots' ? '...' : item.pageN}
            </a>
          </li>
        );
      })}

      <li className={'page-item' + (disabled || !nextPage ? ' disabled' : '')}>
        <a className="page-link" data-page={nextPage} href={'#' + (nextPage ?? '')}>
          {'\u003e'}
        </a>
      </li>
    </ul>
  );
};

export default Pagination;

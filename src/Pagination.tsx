import React from 'react';
import { IPaginationParams, usePagination } from './usePagination';

const Pagination: React.FC<
  IPaginationParams & { disabled?: boolean; onChangePage?: (n: number) => void } & React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
> = ({ totalCount, pageSize, siblingCount = 2, currentPage, disabled = false, onChangePage = () => {}, ...navProps }) => {
  const pagination = usePagination({ totalCount, pageSize, siblingCount, currentPage });

  const clickHandler = React.useCallback<React.MouseEventHandler<HTMLElement>>(
    event => {
      event.preventDefault();
      const page = Number((event.target as HTMLElement).closest('a')?.dataset.page);
      page && onChangePage(page);
    },
    [onChangePage],
  );
  const totalPages = Math.ceil(totalCount / pageSize);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  return (
    <nav {...navProps}>
      <ul className="pagination pagination-sm user-select-none my-0" onClick={clickHandler}>
        <li className={'page-item' + (disabled || !prevPage ? ' disabled' : '')}>
          <a className="page-link" data-page={prevPage} href={'#' + (prevPage ?? '')}>
            {'\u003c'}
          </a>
        </li>

        {pagination.map(item => {
          return (
            <li key={item.pageN} className={'page-item' + (item.pageN === currentPage ? ' active' : '') + (disabled ? ' disabled' : '')}>
              <a className="page-link" data-page={item.pageN} href={'#' + item.pageN}>
                {{ dots: '...', page: item.pageN }[item.type] ?? (item.pageN as never)}
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
    </nav>
  );
};

export default Pagination;

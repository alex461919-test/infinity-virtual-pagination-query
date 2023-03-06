import React from 'react';

export interface IPaginationItem {
  type: 'page' | 'dots';
  pageN: number;
}
export interface IPaginationParams {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  siblingCount?: number;
}

const dots = (left: number, right: number): IPaginationItem => {
  return {
    type: 'dots',
    pageN: left + Math.round((right - left) / 2),
  };
};

const range = (start: number, end: number): IPaginationItem[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => page(idx + start));
};

const page = (n: number): IPaginationItem => ({ type: 'page', pageN: n });

export function usePagination(params: IPaginationParams): IPaginationItem[] {
  const { totalCount, pageSize, siblingCount = 2, currentPage } = params;

  const paginationRange = React.useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    if (totalPageCount > 1) {
      // Pages count is determined as siblingCount*2 + firstPage + lastPage + currentPage + 2*DOTS
      const totalPageNumbers = siblingCount * 2 + 5;

      /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
      if (totalPageNumbers >= totalPageCount) {
        return range(1, totalPageCount);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

      /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPageCount;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = range(1, leftItemCount);

        return [...leftRange, dots(leftItemCount, totalPageCount), page(totalPageCount)];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        const leftIndex = totalPageCount - rightItemCount + 1;
        const rightRange = range(leftIndex, totalPageCount);
        return [page(firstPageIndex), dots(firstPageIndex, leftIndex), ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex);

        return [
          page(firstPageIndex),
          dots(firstPageIndex, leftSiblingIndex),
          ...middleRange,
          dots(rightSiblingIndex, lastPageIndex),
          page(lastPageIndex),
        ];
      }
    }
    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
}

import fakeUsers from './fakeUsers';
import { User } from './types';

export interface FetchResult {
  items: User[];
  pageInfo: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    nextPage?: number;
    prevPage?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const fakeFata = fakeUsers(200);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPage(): Promise<FetchResult>;
async function fetchPage(page: number, pageSize: number): Promise<FetchResult>;
async function fetchPage(page = 1, pageSize = Number.MAX_SAFE_INTEGER): Promise<FetchResult> {
  //
  await sleep(500);

  const totalCount = fakeFata.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = page <= totalPages ? page : totalPages;
  const offset = pageSize * (currentPage - 1);
  const items = fakeFata.slice(offset, pageSize * currentPage);

  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    items,
    pageInfo: {
      totalCount,
      totalPages,
      pageSize,
      currentPage,
      ...(nextPage ? { nextPage } : null),
      ...(prevPage ? { prevPage } : null),
      hasNext: nextPage !== null,
      hasPrev: prevPage !== null,
    },
  };
}

export { fetchPage };

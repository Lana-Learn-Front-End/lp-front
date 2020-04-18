import Page from '@/models/util/page';

export function getDefaultPage<T>(): Page<T> {
  return {
    content: [],
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    totalElements: 0,
    numberOfElements: 0,
    isFirst: true,
    isLast: true,
  };
}

export function getPageFromArray<T>(arr: T[], pageNumber = 1, pageSize = 20) {
  if (arr.length === 0) {
    return getDefaultPage<T>();
  }
  if (pageNumber < 1) {
    pageNumber = 1;
  }
  if (pageSize < 0) {
    throw new Error('The size of page must > 0');
  }
  const totalPages: number = Math.ceil(arr.length / pageSize);
  const isLast: boolean = totalPages === pageNumber;
  const isFirst: boolean = pageNumber === 1;
  const content: T[] = arr.splice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  return {
    content,
    isFirst,
    isLast,
    numberOfElements: content.length,
    pageNumber,
    pageSize,
    totalElements: arr.length,
    totalPages,
  };
}

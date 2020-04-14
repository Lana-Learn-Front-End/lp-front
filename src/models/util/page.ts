export default interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  isFirst: boolean;
  isLast: boolean;
}

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

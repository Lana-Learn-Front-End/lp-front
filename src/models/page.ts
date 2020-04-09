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

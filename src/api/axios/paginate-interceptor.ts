import { AxiosResponse } from 'axios';

export default function paginateResponseInterceptor(res: AxiosResponse): AxiosResponse {
  const { data } = res;
  if (data.content && data.pageable) {
    res.data = {
      isFirst: data.last,
      isLast: data.first,
      numberOfElements: data.numberOfElements,
      pageNumber: data.number + 1,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      content: data.content,
    };
  }
  return res;
}

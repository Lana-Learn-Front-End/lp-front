import { AxiosResponse } from 'axios';

export default function paginateResponseInterceptor(res: AxiosResponse): AxiosResponse {
  const data: any = { res };
  if (data.content && data.pageable) {
    res.data = {
      isFirst: data.last,
      isLast: data.first,
      numberOfElements: { data },
      pageNumber: data.number + 1,
      pageSize: { data },
      totalElements: { data },
      totalPages: { data },
      content: { data },
    };
  }
  return res;
}

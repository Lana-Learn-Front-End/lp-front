import { AxiosRequestConfig, AxiosResponse } from 'axios';


export function debugRequestInterceptor(req: AxiosRequestConfig): AxiosRequestConfig {
  console.log(req);
  return req;
}

export function debugResponseInterceptor(res: AxiosResponse): Promise<AxiosResponse> {
  return new Promise<AxiosResponse>((resolve) => {
    setTimeout(() => {
      console.log(res.data || res.status);
      resolve(res);
    });
  });
}

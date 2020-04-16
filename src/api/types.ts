import { AxiosPromise, AxiosRequestConfig } from 'axios';
import Page from '@/models/util/page';

export interface CrudApi<T, ID> {
  create(payload: any, config?: AxiosRequestConfig): AxiosPromise<T>;

  update(id: ID, payload: T, config?: AxiosRequestConfig): AxiosPromise<T>;

  delete(id: ID, config?: AxiosRequestConfig): AxiosPromise<void>;

  get(id: ID, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface PagedApi<T> {
  getPage(config?: AxiosRequestConfig & {
      params: {
        page?: number;
        size?: number;
        sort?: string;
      };
    },
  ): AxiosPromise<Page<T>>;
}

export interface UnPagedApi<T> {
  getAll(config?: AxiosRequestConfig): AxiosPromise<T[]>
}

import Cast from '@/models/cast';
import { CrudApi, PagedApi, UnPagedApi } from '@/api/types';
import axios, { AxiosPromise, AxiosRequestConfig } from '@/api/axios';
import Page from '@/models/util/page';

const CastApi: CrudApi<Cast, number> & PagedApi<Cast> & UnPagedApi<Cast> = {
  create(cast: Cast): AxiosPromise<Cast> {
    return axios.post('/api/casts', cast);
  },

  update(id: number, payload: Cast): AxiosPromise<Cast> {
    return axios.put(`/api/casts/${id}`, payload);
  },

  get(id: number): AxiosPromise<Cast> {
    return axios.get(`/api/casts/${id}`);
  },

  delete(id: number): AxiosPromise<void> {
    return axios.delete(`/api/casts/${id}`);
  },

  getAll(config?: AxiosRequestConfig): AxiosPromise<Cast[]> {
    return axios.get('/api/casts/all', config);
  },

  getPage(
    config?: AxiosRequestConfig & { params: { page?: number; size?: number; sort?: string } },
  ): AxiosPromise<Page<Cast>> {
    if (config) {
      config.params = { page: 1, size: 20, ...config.params };
    }
    return axios.get('/api/casts', config);
  },
};

export default CastApi;

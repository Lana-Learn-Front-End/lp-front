import Tag from '@/models/tag';
import { CrudApi, UnPagedApi } from '@/api/types';
import axios, { AxiosPromise, AxiosRequestConfig } from '@/api/axios';

const TagApi: CrudApi<Tag, number> & UnPagedApi<Tag> = {
  create(tag: Tag): AxiosPromise<Tag> {
    return axios.post('/api/tags', tag);
  },

  update(id: number, payload: Tag): AxiosPromise<Tag> {
    return axios.put(`/api/tags/${id}`, payload);
  },

  get(id: number): AxiosPromise<Tag> {
    return axios.get(`/api/tags/${id}`);
  },

  delete(id: number): AxiosPromise<void> {
    return axios.delete(`/api/tags/${id}`);
  },

  getAll(config?: AxiosRequestConfig): AxiosPromise<Tag[]> {
    return axios.get('/api/tags/all', config);
  },
};

export default TagApi;

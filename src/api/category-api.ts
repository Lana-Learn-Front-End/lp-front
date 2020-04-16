import Category from '@/models/category';
import { CrudApi, UnPagedApi } from '@/api/types';
import axios, { AxiosPromise, AxiosRequestConfig } from '@/api/axios';

const CategoryApi: CrudApi<Category, number> & UnPagedApi<Category> = {
  create(category: Category): AxiosPromise<Category> {
    return axios.post('/api/categories', category);
  },

  update(id: number, payload: Category): AxiosPromise<Category> {
    return axios.put(`/api/categories/${id}`, payload);
  },

  get(id: number): AxiosPromise<Category> {
    return axios.get(`/api/categories/${id}`);
  },

  delete(id: number): AxiosPromise<void> {
    return axios.delete(`/api/categories/${id}`);
  },

  getAll(config?: AxiosRequestConfig): AxiosPromise<Category[]> {
    return axios.get('/api/categories/all', config);
  },
};

export default CategoryApi;

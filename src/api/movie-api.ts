import Movie from '@/models/movie';
import { CrudApi, PagedApi } from '@/api/types';
import axios, { AxiosPromise, AxiosRequestConfig } from '@/api/axios';
import Page from '@/models/util/page';

const MovieApi: CrudApi<Movie, number> & PagedApi<Movie> = {
  create(movie: Movie): AxiosPromise<Movie> {
    return axios.post('/api/movies', movie);
  },

  update(id: number, payload: Movie): AxiosPromise<Movie> {
    return axios.put(`/api/movies/${id}`, payload);
  },

  get(id: number): AxiosPromise<Movie> {
    return axios.get(`/api/movies/${id}`);
  },

  delete(id: number): AxiosPromise<void> {
    return axios.delete(`/api/movies/${id}`);
  },

  getPage(
    config?: AxiosRequestConfig & { params: { page?: number; size?: number; sort?: string } },
  ): AxiosPromise<Page<Movie>> {
    if (config) {
      config.params = { page: 1, size: 20, ...config.params };
    }
    return axios.get('/api/movies', config);
  },
};

export default MovieApi;

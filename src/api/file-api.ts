import axios, { AxiosPromise } from '@/api/axios';
import FileMetadata from '@/models/file-metadata';

const FileApi = {
  create(type: FileType, file: File): AxiosPromise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`/data/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update(type: FileType, id: string, file: File): AxiosPromise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    return axios.put(`/data/${type}/${id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  get(type: FileType, id: string): AxiosPromise<FileMetadata> {
    return axios.get(`/data/${type}/${id}`);
  },

  delete(type: FileType, id: string): AxiosPromise<void> {
    return axios.delete(`/data/${type}/${id}`);
  },
};

export enum FileType {
  IMAGE = 'images',
  VIDEO = 'videos',
}

export default FileApi;

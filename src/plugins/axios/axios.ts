/* eslint-disable */
import Vue, { PluginObject } from 'vue';
import axios from 'axios';
import paginateResponseInterceptor from '@/plugins/axios/paginate-interceptor';
import {
  debugRequestInterceptor,
  debugResponseInterceptor,
} from '@/plugins/axios/debug-interceptor';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const config = {
  baseURL: process.env.VUE_APP_BASE_URL || process.env.BASE_URL || '',
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.response.use(paginateResponseInterceptor);

if (process.env.NODE_ENV === 'development') {
  axiosInstance.interceptors.response.use(debugResponseInterceptor);
  axiosInstance.interceptors.request.use(debugRequestInterceptor);
}

const Plugin: PluginObject<any> = {
  install: (Vue) => {
    Vue.$axios = axiosInstance;
  },
};

Plugin.install = (Vue) => {
  Vue.$axios = axiosInstance;
  Object.defineProperties(Vue.prototype, {
    $axios: {
      get() {
        return axiosInstance;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;

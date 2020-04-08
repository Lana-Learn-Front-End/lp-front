import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import snackbar from './snackbar';

Vue.use(Vuex);

const store: StoreOptions<any> = {
  modules: {
    snackbar,
  },
};

export default new Vuex.Store(store);

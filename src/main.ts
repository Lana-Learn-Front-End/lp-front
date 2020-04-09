import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './styles.scss';

import vuetify from './plugins/vuetify';
import './plugins/axios/axios';
import './plugins/vee-validate';
import './plugins/class-component-hooks';
import './core/filters';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './styles.scss';

import vuetify from './plugins/vuetify';
import './core/filters';
import './plugins/class-component-hooks';
import './plugins/vee-validate';
import './plugins/event-bus';
import './plugins/axios/axios';
import './plugins/snackbar';
import './plugins/notify-modal';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

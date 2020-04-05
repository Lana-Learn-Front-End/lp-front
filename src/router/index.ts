import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import MovieCreate from '@/views/MovieCreate.vue';
import MovieEdit from '@/views/MovieEdit.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/movies/create',
  },
  {
    path: '/movies/create',
    name: 'MovieCreate',
    component: MovieCreate,
  },
  {
    path: '/movies/:id/edit',
    name: 'MovieEdit',
    component: MovieEdit,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

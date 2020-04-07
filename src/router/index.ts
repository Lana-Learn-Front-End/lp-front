import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import MovieEdit from '@/views/movie/MovieEdit.vue';
import TagManage from '@/views/TagManage.vue';
import MovieManage from '@/views/movie/MovieManage.vue';
import Manage from '@/views/Manage.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/manage',
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage,
    children: [
      {
        path: '/',
        redirect: 'movies',
      },
      {
        path: 'movies',
        name: 'MovieManage',
        component: MovieManage,
      },
      {
        path: 'tags',
        name: 'TagManage',
        component: TagManage,
      },
    ],
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

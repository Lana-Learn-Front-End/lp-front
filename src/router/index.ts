import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TagManage from '@/views/manage/TagManage.vue';
import MovieManage from '@/views/manage/MovieManage.vue';
import Manage from '@/views/manage/Manage.vue';
import CategoryManage from '@/views/manage/CategoryManage.vue';

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
      {
        path: 'categories',
        name: 'CategoryManage',
        component: CategoryManage,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

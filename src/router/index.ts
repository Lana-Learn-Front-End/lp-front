import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TagManage from '@/views/manage/TagManage.vue';
import MovieManage from '@/views/manage/MovieManage.vue';
import ContentManage from '@/views/manage/ContentManager.vue';
import CategoryManage from '@/views/manage/CategoryManage.vue';
import CastManage from '@/views/manage/CastManage.vue';
import Home from '@/views/Home.vue';
import MovieDetail from '@/views/MovieDetail.vue';
import MovieSearch from '@/views/MovieSearch.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: MovieDetail,
  },
  {
    path: '/movies/search',
    name: 'MovieSearch',
    component: MovieSearch,
  },
  {
    path: '/casts/:id',
    name: 'CastDetail',
  },
  {
    path: '/tags/:id',
    name: 'TagDetail',
  },
  {
    path: '/manage',
    name: 'ContentManage',
    component: ContentManage,
    children: [
      {
        path: '/',
        redirect: 'movies',
      },
      {
        path: 'movies',
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
      {
        path: 'casts',
        name: 'CastManage',
        component: CastManage,
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

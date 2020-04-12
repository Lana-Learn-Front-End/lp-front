<template>
  <div class="w-100">
    <v-tabs show-arrows right>
      <v-tab to="/manage/movies">Movies</v-tab>
      <v-tab to="/manage/tags">Tags</v-tab>
      <v-tab to="/manage/categories">Categories</v-tab>
      <v-tab to="/manage/casts">Casts</v-tab>
    </v-tabs>
    <v-sheet class="mt-3 mt-md-5">
      <router-view></router-view>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ContentManage extends Vue {
}
</script>

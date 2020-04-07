<template>
  <v-row justify="center">
    <v-col xl="10" lg="11">
      <v-sheet class="d-flex pa-3">
        <v-spacer></v-spacer>
        <v-btn class="mx-1" to="/manage/movies" text link>Movies</v-btn>
        <v-btn class="mx-1" to="/manage/tags" text link>Tags</v-btn>
        <v-btn class="mx-1" to="/manage/casts" text link>Casts</v-btn>
      </v-sheet>
      <v-sheet class="mt-3 mt-md-5">
        <router-view></router-view>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Manage extends Vue {
}
</script>

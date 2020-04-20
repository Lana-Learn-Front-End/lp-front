<template>
  <div class="d-flex flex-column">
    <movie-list-box
      :movies="featuredMovies"
      :rows-per-page="2"
      title="Featured videos"
      cols="12"
      sm="6"
      md="4"
    >
    </movie-list-box>
    <movie-list-box
      :movies="mostViewedMovies"
      :rows-per-page="2"
      title="Most viewed"
      class="mt-5"
      cols="12"
      sm="6"
      md="4"
    >
    </movie-list-box>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import MovieListBox from '@/components/movie/MovieListBox.vue';
import MovieApi from '@/api/movie-api';
import Movie from '@/models/movie';

@Component({
  components: { MovieListBox },
})
export default class Home extends Vue {
  featuredMovies: Movie[] = [];
  mostViewedMovies: Movie[] = [];

  created() {
    MovieApi
      .getPage({
        params: {
          sort: 'createdAt,desc',
        },
      })
      .then((res) => {
        this.featuredMovies = res.data.content;
      });

    MovieApi
      .getPage({
        params: {
          sort: 'view,desc',
        },
      })
      .then((res) => {
        this.mostViewedMovies = res.data.content;
      });
  }
}
</script>

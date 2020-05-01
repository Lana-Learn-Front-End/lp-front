<template>
  <div>
    <v-row>
      <v-col
        v-for="movie of movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
      >
        <movie-card
          class="h-100"
          :movie="movie"
          :to="{ name: 'MovieDetail', params: { id: movie.id } }"
        >
        </movie-card>
      </v-col>
    </v-row>
    <v-pagination
      class="mt-5"
      :total-visible="11"
      :length="0"
    >
    </v-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Movie from '@/models/movie';
import { Route } from 'vue-router';

import MovieCard from '@/components/movie/MovieCard.vue';
import { Hook } from '@/core/decorators';
import MovieApi from '../api/movie-api';

@Component({
  components: { MovieCard },
})
export default class MovieSearch extends Vue {
  sort = 'updatedAt,desc';
  search = '';

  get movies(): Movie[] {
    return [];
  }

  @Hook()
  created() {
    this.fetchMovies();
  }

  beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.fetchMovies();
    next();
  }

  async fetchMovies(): Promise<void> {
    await MovieApi
      .getPage({
        params: {
          sort: this.sort,
          page: 1,
          q: `name=ilike=${this.search}`,
        },
      });
  }

  private mapRouteParamToProps(route: Route) {

  }
}
</script>

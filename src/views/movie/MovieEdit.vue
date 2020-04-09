<template>
  <v-card v-if="movie" class="w-100">
    <v-card-title
      :class="{
        'title': $vuetify.breakpoint.mdAndUp,
        'subtitle-1 font-weight-bold': $vuetify.breakpoint.smAndDown
      }"
    >
      [{{movie.code}}] {{movie.name}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="7" lg="6" class="px-3 px-md-5 px-lg-8">
          <movie-cover-upload :movie="movie"></movie-cover-upload>
        </v-col>
        <v-col>
          <movie-form
            :edit="movie"
            @update="fetchMovieOrTo404($event.id)"
            enable-delete
            @delete="returnToPreviousRoute()"
          >
            <template v-slot:actions>
              <v-btn text @click="returnToPreviousRoute()">Back</v-btn>
            </template>
          </movie-form>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import Movie from '@/models/movie';
import MovieCoverUpload from '@/components/movie/MovieCoverUpload.vue';
import MovieForm from '@/components/movie/MovieForm.vue';

@Component({
  components: { MovieCoverUpload, MovieForm },
})
export default class MovieEdit extends Vue {
  movie: Movie | null = null;
  form!: any;

  async created(): Promise<void> {
    this.fetchMovieOrTo404(this.$router.currentRoute.params.id);
  }

  beforeRouteEnter(to: Route, from: Route, next: Function): void {
    this.fetchMovieOrTo404(from.params.id);
    next();
  }

  private async fetchMovieOrTo404(movieId: string): Promise<void> {
    try {
      this.movie = (await this.$axios.get(`/api/movies/${movieId}`)).data;
    } catch (e) {
      await this.$router.push({ name: '404' });
    }
  }

  returnToPreviousRoute() {
    this.$router.back();
  }
}
</script>

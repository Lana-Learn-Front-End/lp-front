<template>
  <v-row justify="center">
    <v-col xl="4" lg="5" md="7" sm="9" cols="11">
      <v-card>
        <v-card-title>New Movie</v-card-title>
        <v-card-text>
          <movie-form
            type="POST"
            url="/api/movies"
            @success="onSuccess($event)"
          >
          </movie-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MovieForm from '@/components/movie/MovieForm.vue';
import Movie from '@/models/movie';

@Component({
  components: { MovieForm },
})
export default class MovieCreate extends Vue {
  onSuccess(movie: Movie): void {
    this.$router.push({ name: 'MovieEdit', params: { id: movie.id.toString() } });
  }
}
</script>

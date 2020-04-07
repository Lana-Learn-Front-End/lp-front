<template>
  <v-card>
    <v-card-title>Movies Management</v-card-title>
    <v-card-text>
      <div class="d-flex align-center">
        <v-text-field
          single-line
          append-icon="search"
          name="filter"
          placeholder="Filter movies"
        >
        </v-text-field>
        <v-spacer class="d-none d-sm-block"></v-spacer>
        <v-btn
          text
          class="ml-4 ml-sm-0"
          @click.stop="createDialog = true"
        >
          <v-icon class="d-none d-sm-block">add</v-icon>
          <span>New</span>
        </v-btn>
        <v-dialog
          v-model="createDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>New Movie</v-card-title>
            <v-card-text>
              <movie-form @create="onCreated($event)">
                <template v-slot:actions>
                  <v-btn
                    text
                    @click.stop="createDialog = false"
                  >
                    Cancel
                  </v-btn>
                </template>
              </movie-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MovieForm from '@/components/movie/MovieForm.vue';
import Movie from '@/models/movie';

@Component({
  components: { MovieForm },
})
export default class MovieManage extends Vue {
  createDialog = false;

  onCreated(movie: Movie): void {
    this.$router.push({ name: 'MovieEdit', params: { id: movie.id.toString() } });
  }
}
</script>

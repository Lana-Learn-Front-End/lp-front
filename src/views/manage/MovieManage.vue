<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span>Movies Management</span>
      <v-btn
        text
        class="ml-3 ml-sm-0"
        @click.stop="createDialog = true"
      >
        <v-icon left>add</v-icon>
        <span>New</span>
      </v-btn>
      <!-- create dialog-->
      <v-dialog
        v-model="createDialog"
        @click:outside="closeCreateDialog()"
        max-width="500px"
      >
        <v-card>
          <v-card-title>New Movie</v-card-title>
          <v-card-text>
            <movie-form
              ref="createForm"
              @create="onMovieCreated($event)"
            >
              <template v-slot:actions>
                <v-btn
                  text
                  @click.stop="closeCreateDialog()"
                >
                  Cancel
                </v-btn>
              </template>
            </movie-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-card-text>
      <div class="d-flex align-center">
        <v-text-field
          single-line
          append-icon="search"
          name="filter"
          placeholder="Filter movies"
        >
        </v-text-field>
        <MovieSortingDropdown class="ml-3" v-model="sort"></MovieSortingDropdown>
        <v-spacer class="d-none d-sm-block"></v-spacer>
      </div>

      <div class="mt-5 mt-md-8">
        <div class="text-center" v-show="!loading && movies.length  === 0">
          <span class="body-1">No movies found</span>
        </div>

        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <v-row>
          <v-col
            v-for="movie of movies"
            :key="movie.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              height="100%"
              @click.stop="openUpdateDialog(movie)"
            >
              <div>
                <v-img v-if="movie.cover"></v-img>
                <base-placeholder-image
                  v-if="!movie.cover"
                  :aspect-ratio="800/540"
                >
                </base-placeholder-image>
              </div>
              <v-card-title class="body-1">
                <div>
                  [{{ movie.code }}] {{ movie.name | truncate(120, true)}}
                </div>
              </v-card-title>
            </v-card>
            <v-dialog v-model="updateDialog" fullscreen>
              <template v-slot:default>
                <movie-edit
                  :movie="updateDialogMovie"
                  @update="onMovieUpdate($event)"
                  @delete="onMovieDelete()"
                  @complete="closeUpdateDialog()"
                >
                </movie-edit>
              </template>
            </v-dialog>
          </v-col>
        </v-row>
      </div>

      <v-pagination
        class="mt-5"
        v-model="page"
        :total-visible="5"
        :length="totalPages"
      >
      </v-pagination>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import MovieForm from '@/components/movie/MovieForm.vue';
import Movie from '@/models/movie';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';
import Page from '@/models/page';
import { AxiosResponse } from 'axios';
import MovieSortingDropdown from '@/components/movie/MovieSortingDropdown.vue';
import MovieEdit from '@/components/movie/MovieEdit.vue';

@Component({
  components: { MovieEdit, MovieSortingDropdown, BasePlaceholderImage, MovieForm },
})
export default class MovieManage extends Vue {
  createDialog = false;
  updateDialog = false;
  updateDialogMovie: Movie | null = null;
  movies: Movie[] = [];
  loading = false;
  page = 1;
  totalPages = 1;
  sort = '';

  $refs!: {
    createForm: MovieForm & { reset: () => void };
  };

  created() {
    this.fetchMovies();
  }

  @Watch('page')
  pageChange() {
    this.fetchMovies();
  }

  @Watch('sort')
  sortChange() {
    this.fetchMovies();
  }

  onMovieUpdate(movie: Movie) {
    Object.assign(this.updateDialogMovie, movie);
  }

  async onMovieDelete() {
    this.closeUpdateDialog();
    await this.fetchMovies();
  }

  async onMovieCreated(movie: Movie) {
    this.createDialog = false;
    await this.fetchMovies();
    this.openUpdateDialog(this.movies.find((m: Movie) => m.id === movie.id) || movie);
  }

  openUpdateDialog(movie: Movie) {
    this.updateDialogMovie = movie;
    this.updateDialog = true;
  }

  closeUpdateDialog() {
    this.updateDialogMovie = null;
    this.updateDialog = false;
  }

  closeCreateDialog() {
    this.createDialog = false;
    this.$refs.createForm.reset();
  }

  async fetchMovies(): Promise<void> {
    this.loading = true;
    await this.$axios
      .get('/api/movies', {
        params: {
          page: this.page,
          sort: this.sort,
        },
      })
      .then((res: AxiosResponse<Page<Movie>>) => res.data)
      .then((moviePage: Page<Movie>) => {
        this.movies = moviePage.content;
        this.totalPages = moviePage.totalPages;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
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
        max-width="500px"
        retain-focus
        @click:outside="closeCreateDialog()"
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
          name="search"
          placeholder="Search movies"
          v-model.trim="search"
          @keyup.enter="onSearch()"
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
            xl="3"
          >
            <movie-card
              class="h-100"
              :movie="movie"
              @click="openUpdateDialog(movie)"
            >
            </movie-card>
          </v-col>
          <v-dialog
            v-model="updateDialog"
            fullscreen
          >
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
import Page from '@/models/util/page';
import MovieSortingDropdown from '@/components/movie/MovieSortingDropdown.vue';
import MovieEdit from '@/components/movie/MovieEdit.vue';
import MovieCard from '@/components/movie/MovieCard.vue';
import MovieApi from '@/api/movie-api';

@Component({
  components: { MovieCard, MovieEdit, MovieSortingDropdown, BasePlaceholderImage, MovieForm },
})
export default class MovieManage extends Vue {
  movies: Movie[] = [];

  createDialog = false;
  updateDialog = false;
  updateDialogMovie: Movie | null = null;
  loading = false;

  page = 1;
  totalPages = 1;
  sort = '';
  search = '';

  $refs!: {
    createForm: MovieForm & { reset(): void };
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

  onSearch() {
    if (this.page === 1) {
      this.fetchMovies();
    } else {
      // page change will trigger fetch.
      this.page = 1;
    }
  }

  onMovieUpdate(movie: Movie) {
    Object.assign(this.updateDialogMovie, movie);
  }

  async onMovieDelete() {
    this.closeUpdateDialog();
    await this.fetchMovies();
  }

  async onMovieCreated(movie: Movie) {
    this.closeCreateDialog();
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
    await MovieApi
      .getPage({
        params: {
          page: this.page,
          sort: this.sort,
          q: getQueryString(this.search),
        },
      })
      .then((res) => res.data)
      .then((moviePage: Page<Movie>) => {
        this.movies = moviePage.content;
        this.totalPages = moviePage.totalPages;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}

function getQueryString(keyword: string): string {
  if (!keyword) {
    return '';
  }
  return `name=ilike=${keyword},code=ilike=${keyword}`;
}
</script>

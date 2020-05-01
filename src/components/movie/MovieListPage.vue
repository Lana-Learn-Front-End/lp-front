<template>
  <div>
    <v-row>
      <v-col
        v-for="movie of movies"
        :key="movie.id"
        :cols="cols || 12"
        :sm="sm || 6"
        :md="md || 4"
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
      :total-visible="totalVisible"
      :length="totalPages"
      v-model="pageNumber"
    >
    </v-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';
import Movie from '@/models/movie';
import MovieCard from '@/components/movie/MovieCard.vue';
import { mixins } from 'vue-class-component';
import GridLayoutMixin from '@/mixins/grid-layout-mixins';

@Component({
  components: { MovieCard },
})
export default class MovieListPage extends mixins(GridLayoutMixin) {
  @Prop({ type: Array, required: true }) movies!: Movie[];
  @Prop({ type: Number, required: true }) page!: number;
  @Prop({ type: Number, required: true }) totalPages!: number;
  @Prop({ type: Number, default: 5 }) totalVisible!: number;

  get pageNumber(): number {
    return this.page;
  }

  set pageNumber(page: number) {
    this.page = page;
    this.pageChange(page);
  }

  @Emit()
  pageChange(page: number) {
    return page;
  }
}
</script>

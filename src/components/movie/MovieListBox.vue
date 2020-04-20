<template>
  <v-card>
    <v-card-title>
      <span>
        {{ title }}
        <v-btn
          v-if="to"
          icon
          class="d-inline d-sm-none"
        >
          <v-icon>link</v-icon>
        </v-btn>
      </span>
      <v-btn
        v-if="to"
        color="primary darken-2"
        small
        class="ml-3 d-none d-sm-block"
      >
        See more
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-window
        v-intersect="{ handler:startAutoSwitch }"
        v-model="window"
        show-arrows
        show-arrows-on-hover
      >
        <v-window-item
          v-for="(group, i) of movieGroups"
          :key="i"
        >
          <v-row>
            <v-col
              v-for="movie of group"
              :key="movie.id"
              :cols="cols"
              :sm="sm"
              :md="md"
              :lg="lg"
            >
              <movie-card
                class="h-100"
                :movie="movie"
                :to="{ name: 'MovieDetail', params: { id: movie.id } }"
              >
              </movie-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Movie from '@/models/movie';
import MovieCard from '@/components/movie/MovieCard.vue';
import { Route } from 'vue-router';
import { mixins } from 'vue-class-component';
import GridLayoutMixin from '@/mixins/grid-layout-mixins';

@Component({
  components: { MovieCard },
})
export default class MovieListBox extends mixins(GridLayoutMixin) {
  @Prop({ type: Array, required: true }) movies!: Movie[];
  @Prop({ type: String, default: 'Movies' }) title!: string;
  @Prop({ type: [String, Object] }) to?: string | Route;
  @Prop({ type: Boolean }) autoSwitch!: boolean;
  @Prop({ type: [Number, String, Boolean], default: false }) rows!: number | string;

  window = 0;
  private windowAutoSwitchId?: number;

  data() {
    return {
      windowAutoSwitchId: undefined,
    };
  }

  destroyed() {
    if (!this.autoSwitch || this.windowAutoSwitchId !== undefined) {
      clearInterval(this.windowAutoSwitchId);
    }
  }

  startAutoSwitch() {
    if (!this.autoSwitch || this.windowAutoSwitchId !== undefined) {
      return;
    }
    this.windowAutoSwitchId = setInterval(() => {
      if (this.window === this.movieGroups.length - 1) {
        this.window = 0;
      } else {
        this.window += 1;
      }
    }, 5000);
  }

  get movieGroups(): Movie[][] {
    let groupIndex = 0;
    const groups: Movie[][] = [];
    this.movies.forEach((movie: Movie, i: number) => {
      if (i % this.itemPerGroup === 0) {
        groups.push([movie]);
        groupIndex = i / this.itemPerGroup;
      } else {
        groups[groupIndex].push(movie);
      }
    });
    return groups;
  }

  get itemPerGroup(): number {
    if (this.$vuetify.breakpoint.xl && this.xl) {
      return calculateNumberOfItem(this.rows, this.xl);
    }
    if (this.$vuetify.breakpoint.lgAndUp && this.lg) {
      return calculateNumberOfItem(this.rows, this.lg);
    }
    if (this.$vuetify.breakpoint.mdAndUp && this.md) {
      return calculateNumberOfItem(this.rows, this.md);
    }
    if (this.$vuetify.breakpoint.smAndUp && this.sm) {
      return calculateNumberOfItem(this.rows, this.sm);
    }
    return calculateNumberOfItem(this.rows, this.cols);
  }
}

function calculateNumberOfItem(rows: number | string | boolean, cols: number | string | boolean) {
  cols = Number(cols) || 12;
  rows = Number(rows) || 1;
  return rows * Math.floor(12 / cols);
}
</script>

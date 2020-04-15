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
              cols="12"
              sm="6"
              md="4"
            >
              <movie-card
                :movie="movie"
                :to="{ name: 'MovieDetail', params: { id: 0 } }"
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import Movie from '@/models/movie';
import MovieCard from '@/components/movie/MovieCard.vue';
import { Route } from 'vue-router';

@Component({
  components: { MovieCard },
})
export default class MovieListBox extends Vue {
  @Prop({ type: Array, required: true }) movies!: Movie[];
  @Prop({ type: String, default: 'Movies' }) title!: string;
  @Prop({ type: [String, Object] }) to?: string | Route;

  window = 0;
  private windowAutoSwitchId?: number;

  data() {
    return {
      windowAutoSwitchId: undefined,
    };
  }

  destroyed() {
    if (this.windowAutoSwitchId !== undefined) {
      clearInterval(this.windowAutoSwitchId);
    }
  }

  startAutoSwitch() {
    if (this.windowAutoSwitchId !== undefined) {
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
    if (this.$vuetify.breakpoint.xsOnly) {
      return 1;
    }
    if (this.$vuetify.breakpoint.smOnly) {
      return 2;
    }
    return 3;
  }
}
</script>

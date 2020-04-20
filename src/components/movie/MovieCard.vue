<template>
  <v-card
    @click="click()"
    :to="to"
  >
    <div class="movie-card__cover-image">
      <v-img
        v-if="movie.cover"
        :src="movie.cover | image"
        :aspect-ratio="800/540"
      >
      </v-img>
      <base-placeholder-image
        v-if="!movie.cover"
        :aspect-ratio="800/540"
      >
      </base-placeholder-image>
      <div class="movie-card__view-count px-1">
        <v-icon x-small class="mr-1">visibility</v-icon>
        <span class="caption">{{ movie.view || 0 }}</span>
      </div>
    </div>

    <v-card-title class="body-1 font-weight-bold">{{ movie.code }}</v-card-title>
    <v-card-subtitle>{{ movie.name | truncate(maxNameLength, true) }}</v-card-subtitle>

    <v-card-text>
      <div class="mb-2" v-if="movie.updatedAt">
        <v-icon small class="mr-2">event</v-icon>
        <span>{{ movie.updatedAt | date }}</span>
      </div>
      <div class="mb-2" v-if="movie.tags.length > 0">
        <v-icon small class="mr-1">local_offer</v-icon>
        <v-chip
          v-for="tag of movie.tags"
          :key="tag.id"
          small
          label
          class="ml-1 mt-1"
          color="yellow darken-4"
          :to="{ name:'TagDetail', params: { id: tag.id } }"
        >
          {{ tag.name }}
        </v-chip>
      </div>
      <div v-if="movie.casts.length > 0">
        <v-icon small class="mr-1">person</v-icon>
        <v-chip
          v-for="cast of movie.casts"
          :key="cast.id"
          small
          label
          class="ml-1 mt-1"
          color="primary darken-2"
          :to="{ name:'CastDetail', params: { id: cast.id } }"
        >
          {{ cast.name }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import Movie from '@/models/movie';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';
import { Route } from 'vue-router';

@Component({
  components: { BasePlaceholderImage },
})
export default class MovieCard extends Vue {
  @Prop({ required: true }) movie!: Movie;
  @Prop() to!: string | Route;

  get maxNameLength(): number {
    if (this.$vuetify.breakpoint.lgAndUp) {
      return 150;
    }
    return 120;
  }

  @Emit()
  click() {
  }
}
</script>

<style scoped>
  .movie-card__cover-image {
    position: relative;
  }

  .movie-card__view-count {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(18, 18, 18, .5);
    border-top-left-radius: 10px;
  }
</style>

<template>
  <div v-if="movie">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-title class="no">
            <span class="mr-3">[{{movie.code}}]</span>
            <span class="body-1">{{movie.name}}</span>
          </v-card-title>
          <base-placeholder-image
            v-if="!movie.source"
            :aspect-ratio="2"
            icon="videocam_off"
          >
          </base-placeholder-image>
          <video
            v-if="movie.source"
            :src="movie.source | video"
            class="w-100"
          >
          </video>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <movie-card :movie="movie"></movie-card>
        <v-card class="mt-3">
          <v-card-title class="body-1 font-weight-bold">Cast List</v-card-title>
          <v-list rounded>
            <v-list-item
              v-for="cast in movie.casts"
              :key="cast.id"
              to="/casts/"
            >
              <v-list-item-avatar class="grey darken-3">
                <v-img
                  v-if="cast.image"
                  :src="cast.image | image"
                >
                </v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="cast.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="movie.casts.length === 0">
              <v-list-item-subtitle class="text-center">
                No casts found :(
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <div class="mt-5 mt-lg-10">
      <v-divider class="mb-5"></v-divider>
      <movie-list-box
        title="Related cast"
        :movies="relatedCast"
        v-if="relatedCast.length > 0"
        class="mb-5 mb-lg-8"
        cols="12"
        sm="6"
        md="4"
      >
      </movie-list-box>
      <movie-list-box
        title="Related tag"
        :movies="relatedTag"
        v-if="relatedTag.length > 0"
        class="mb-5 mb-lg-8"
        rows="2"
        cols="12"
        sm="6"
        md="4"
      >
      </movie-list-box>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Movie from '@/models/movie';
import MovieApi from '@/api/movie-api';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';
import MovieCard from '@/components/movie/MovieCard.vue';
import Cast from '@/models/cast';
import Tag from '@/models/tag';
import MovieListBox from '@/components/movie/MovieListBox.vue';
import { Hook } from '@/core/decorators';

@Component({
  components: { MovieListBox, MovieCard, BasePlaceholderImage },
})
export default class MovieDetail extends Vue {
  movie!: Movie;
  relatedCast: Movie[] = [];
  relatedTag: Movie[] = [];

  data() {
    return {
      movie: undefined,
    };
  }

  @Hook()
  async created() {
    // fallback to undefined because Number(undefined) is NaN,
    // while Number('') or Number(null) is 0
    const id = Number(this.$router.currentRoute.params.id ?? undefined);
    if (Number.isNaN(id)) {
      await this.$router.push({ name: '404' });
    } else {
      await MovieApi
        .get(id)
        .then((res) => {
          this.movie = res.data;
        })
        .catch(() => this.$router.push({ name: '404' }));
    }

    if (this.movie.casts.length > 0) {
      MovieApi
        .getPage({
          params: {
            size: 9,
            sort: 'view,desc',
            q: getCastQuery(this.movie.casts),
          },
        })
        .then((res) => {
          this.relatedCast = res.data.content;
        });
    }

    if (this.movie.tags.length > 0) {
      MovieApi
        .getPage({
          params: {
            size: 12,
            sort: 'view,desc',
            q: getTagQuery(this.movie.tags),
          },
        })
        .then((res) => {
          this.relatedTag = res.data.content;
        });
    }
  }
}

function getCastQuery(casts: Cast[]): string {
  return casts
    .map((cast: Cast) => `casts.id==${cast.id}`)
    .join(',');
}

function getTagQuery(tags: Tag[]): string {
  return tags
    .map((tag: Tag) => `tags.id==${tag.id}`)
    .join(',');
}
</script>
